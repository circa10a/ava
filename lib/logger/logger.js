const { transports, createLogger, format } = require('winston');

const logger = createLogger({
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(
      (info) => `[${info.level}] ${info.timestamp}: ${info.message}`,
    ),
  ),
  transports: [
    new (transports.Console)({
      formatter(options) {
        return `${options.level} ${options.timestamp}: ${options.message}`;
      },
    }),
  ],
});

module.exports = logger;