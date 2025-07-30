// export const mapBotCollectionFromDB = (data: any): any => {
//   const parceBot = {
//     id: data._id.toString(),
//     account: data.account,
//     date_time: data.date_time,
//     local_process: data.local_process,
//     description: data.description,
//     greeting_text: data.greeting_text,
//     name: data.name,
//     webhook: data.webhook,
//     chat_redirect_type: data.chat_redirect_type,
//     audio_error_message: data.audio_error_message,
//     status: data.status,
//     message_header: data.message_header,
//     message_footer: data.message_footer,
//     speech_to_text: data.speech_to_text,
//     message_platform: data.message_platform,
//     ticket_counter: data.ticket_counter
//   }

//   switch (data.message_platform) {

//     case "messenger":
//       return {
//         ...parceBot,
//         page_access_token: data.page_access_token
//       }

//     case "instagram":
//       return {
//         ...parceBot,
//         page_access_token: data.page_access_token
//       }

//     case "webchat":
//       return {
//         ...parceBot
//       }

//     case "telegram":
//       return {
//         ...parceBot,
//         token: data.token
//       }

//     default:
//       return {
//         ...parceBot,
//         api_key: data.api_key,
//         phone_number_id: data.phone_number_id,
//         whatsapp_business_account_id: data.whatsapp_business_account_id
//       }
//   }
// }

// export const mapDBParsedData = (data: any): any => {
//   const parceBot = {
//     _id: data.id.toString(),
//     account: data.account,
//     date_time: data.date_time,
//     local_process: data.local_process,
//     description: data.description,
//     greeting_text: data.greeting_text,
//     name: data.name,
//     webhook: data.webhook,
//     chat_redirect_type: data.chat_redirect_type,
//     audio_error_message: data.audio_error_message,
//     status: data.status,
//     message_header: data.message_header,
//     message_footer: data.message_footer,
//     speech_to_text: data.speech_to_text,
//     message_platform: data.message_platform,
//     ticket_counter: data.ticket_counter
//   }

//   switch (data.message_platform) {

//     case "messenger":
//       return {
//         ...parceBot,
//         page_access_token: data.page_access_token
//       }

//     case "instagram":
//       return {
//         ...parceBot,
//         page_access_token: data.page_access_token
//       }

//     case "webchat":
//       return { ...parceBot }

//     case "telegram":
//       return {
//         ...parceBot,
//         token: data.token
//       }

//     default:
//       return {
//         ...parceBot,
//         api_key: data.api_key,
//         phone_number_id: data.phone_number_id,
//         whatsapp_business_account_id: data.whatsapp_business_account_id
//       }
//   }
// }

export const mapDBUpdateParsedData = (data: any): any => {
  const parceBot = {
    local_process: data.local_process,
    description: data.description,
    greeting_text: data.greeting_text,
    name: data.name,
    webhook: data.webhook,
    chat_redirect_type: data.chat_redirect_type,
    audio_error_message: data.audio_error_message,
    status: data.status,
    message_header: data.message_header,
    message_footer: data.message_footer,
    speech_to_text: data.speech_to_text,
    message_platform: data.message_platform,
    ticket_counter: data.ticket_counter
  }

  switch (data.message_platform) {
    case 'messenger':
      return {
        ...parceBot,
        page_access_token: data.page_access_token
      }

    case 'instagram':
      return {
        ...parceBot,
        page_access_token: data.page_access_token
      }

    case 'webchat':
      return {
        ...parceBot
      }

    case 'telegram':
      return {
        ...parceBot,
        token: data.token
      }

    default:
      return {
        ...parceBot,
        api_key: data.api_key,
        phone_number_id: data.phone_number_id,
        whatsapp_business_account_id: data.whatsapp_business_account_id
      }
  }
}
