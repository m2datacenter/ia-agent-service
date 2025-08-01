import { RedisClientType } from 'redis'
import { Router, Request, Response, NextFunction } from 'express'
import { AuthorizationMiddlewareExpress } from '../middlewares/AuthorizationMiddlewareExpress'
import { IServiceBotGet } from '../../../application/interfaces/services/IServiceBotGet'
import { IServiceContactGet } from '../../../application/interfaces/services/IServiceContactGet'

export class CreateMessageExpressRouter {
  constructor(
    private readonly authorizationMiddlewareExpress: AuthorizationMiddlewareExpress,
    private readonly redisClient: RedisClientType,
    private readonly serviceBotGet: IServiceBotGet,
    private readonly serviceContactGet: IServiceContactGet
  ) {}

  getRouter(): Router {
    return Router().post(
      '/accounts/:accountId/bots/:botId/contacts/:contactId/create-message',
      this.authorizationMiddlewareExpress.handle('messages.api'),
      async (req: Request, res: Response, next: NextFunction) => {
        // const response = await this.createBotController.handle({
        //   account: { id: req._authData.account.id },
        //   partialBot: req.body
        // })
        // if (response.statusCode === 500) return next(response)
        // res.status(response.statusCode).json(response.body)

        const { messages } = req.body

        const accountId = req._authData.account.id
        const accountName = req._authData.account.name
        const contactId = req.params.contactId
        const botId = req.params.botId

        if (!contactId) {
          return res.status(400).json({ error: 'contact.id is required' })
        }

        if (!botId) {
          return res.status(400).json({ error: 'bot.id is required' })
        }

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
          return res.status(400).json({ error: 'messages is required and must be a non-empty array' })
        }

        // Validate contact
        const { contact, error: contactError } = await this.serviceContactGet.execute({
          account: { id: accountId },
          contact: { id: contactId }
        })

        if (contactError) {
          return res.status(404).json({ error: contactError.message })
        }

        const { bot, error: botError } = await this.serviceBotGet.execute({
          account: { id: accountId },
          bot: { id: botId }
        })

        if (botError) {
          return res.status(404).json({ error: botError.message })
        }

        const validatedMessages = []

        try {
          for (const message of messages) {
            if (!message.message_type || typeof message.message_type !== 'string' || message.message_type !== 'text') {
              throw new Error('Each message must have a message_type property of type string and equal to "text"')
            }

            if (!message.text || typeof message.text !== 'string' || !message.text.trim().length) {
              throw new Error('Each message must have a text property of type string')
            }

            if (!message.role || typeof message.role !== 'string' || message.role !== 'system') {
              throw new Error('Each message must have a role property of type string and equal to "system"')
            }

            validatedMessages.push({
              text: message.text,
              message_type: message.message_type,
              role: message.role
            })
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
          return res.status(400).json({ error: errorMessage })
        }

        const waitingData = await this.redisClient.hGetAll(`contact:${contactId}:waiting_data`)

        if (!waitingData.redirect_to_openai_assistant) {
          return res.status(404).json({ error: 'No redirect_to_openai_assistant found in waiting data' })
        }

        const openaiAssistantData = JSON.parse(waitingData.openai_assistant_data)

        const eventExpireData = JSON.stringify({
          event_type: 'openai_assistant_expire',
          payload: {
            account: { _id: accountId },
            contact: { _id: contactId },
            bot: { bot_id: botId }
          }
        })

        const queueData = {
          openai: {
            api_key: openaiAssistantData.api_key,
            model_id: openaiAssistantData.model_id,
            instructions: openaiAssistantData.instructions,
            human_agent_triggers: openaiAssistantData.human_agent_triggers,
            mcp_tools: openaiAssistantData.mcp_tools,
            contact_fields_to_update: openaiAssistantData.contact_fields_to_update
          },
          account: { id: accountId, name: accountName },
          event_expire_data: eventExpireData,
          intention: { redirect_after_close_thread: openaiAssistantData.redirect_after_close_thread },
          messages: validatedMessages,
          contact: { id: contact.id, whatsapp_id: contact.whatsapp_id },
          bot: {
            id: bot.id,
            phone_number_id: bot.phone_number_id,
            api_key: bot.api_key,
            message_platform: bot.message_platform
          }
        }

        await this.redisClient.lPush('openai_queue', JSON.stringify(queueData))

        res.status(201).json({
          message: 'created successfully'
        })
      }
    )
  }
}
