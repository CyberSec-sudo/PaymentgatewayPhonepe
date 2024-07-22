require('dotenv').config({ path: './src/config/.env' })
const logger = require('pino')()
const config = require('./config/config')
const app = require('./config/express')
const cron = require('node-cron')
const performTask = require('./scheduledTask')

let server = app.listen(config.port, async () => {
    logger.info(`Listening on port ${config.port}`)
})

// Schedule the task to run every 30 minutes
cron.schedule('*/10 * * * *', async () => {
    await performTask()
})

// Access the environment variables

const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info('Server closed')
            process.exit(1)
        })
    } else {
        process.exit(1)
    }
}

const unexpectedErrorHandler = (error) => {
    logger.error(error)
    exitHandler()
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)

process.on('SIGTERM', () => {
    logger.info('SIGTERM received')
    if (server) {
        server.close()
    }
})

module.exports = server
