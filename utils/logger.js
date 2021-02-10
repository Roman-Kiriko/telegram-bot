const winston = require('winston')

const logger = winston.createLogger({
    level: 'info',
    transports: new winston.transports.Console({
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true
    }),
    exitOnError: false
})

module.exports = logger