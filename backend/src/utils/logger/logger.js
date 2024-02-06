const { format, createLogger, transports, addColors } = require('winston');
require('winston-daily-rotate-file');

const logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.DailyRotateFile({
      datePattern: 'YYYY-MM-DD',
      filename: 'logs/combined-%DATE%.log',
    }),
    new transports.DailyRotateFile({
      datePattern: 'YYYY-MM-DD',
      filename: 'logs/error-%DATE%.log',
      level: 'error',
    }),
  ],
  format: format.combine(
    format.json(),
    format.colorize(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    format.printf((info) => {
      let message = `${info.timestamp} ${info.level}: ${info.message}`;
      if (info.stack) {
        message += `\nStack Trace:\n${info.stack}`;
      }
      return message;
    })
  ),
});

addColors({
  error: 'bold red',
  warn: 'bold yellow',
  info: 'bold cyan',
  debug: 'bold green',
});

module.exports = logger;
