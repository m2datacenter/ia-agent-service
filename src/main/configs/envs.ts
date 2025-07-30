export default {
  MONGO_URI:
    process.env.MONGO_URI || 'mongodb://mongoadmin:secret@localhost:27017/botsoluti-dev?retryWrites=true&w=majority&authSource=admin',
  PORT: process.env.PORT || 8102,
  AUTH_SERVICE_HOST: process.env.AUTH_SERVICE_HOST || 'http://localhost:8091/public',
  REDIS_URI: process.env.REDIS_URI || 'redis://127.0.0.1:6379',
  REDIS_DB: process.env.REDIS_DB || '1',
  LOGGER_SERVICE_HOST: process.env.LOGGER_SERVICE_HOST || 'http://localhost:8070',
  BOT_SERVICE_HOST: process.env.BOT_SERVICE_HOST || 'http://localhost:8095/private',
  CONTACT_SERVICE_HOST: process.env.CONTACT_SERVICE_HOST || 'http://localhost:8096/private'
}
