const { format, createLogger, transports, addColors } = require('winston');

const logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/combined.log' }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
  ],
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
});

addColors({
  error: 'bold red',
  warn: 'bold yellow',
  info: 'bold cyan',
  debug: 'bold green',
});

module.exports = logger;
