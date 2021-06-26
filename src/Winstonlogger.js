const {createLogger, transports, format}= require("winston")
require("winston-mongodb")

const logger = createLogger({
    transports : [
        new transports.MongoDB({
            db : "mongodb://127.0.0.1:27017/registration",
            collection : "api_logs",
            level : "info",
            options : { useUnifiedTopology: true },
            format : format.combine(format.timestamp(), format.json())
        }),
        new transports.MongoDB({
            db : "mongodb://127.0.0.1:27017/registration",
            collection : "error_logs",
            level : "error",
            options : { useUnifiedTopology: true },
            format : format.combine(format.timestamp(), format.json())
        })
    ]
})

module.exports = logger