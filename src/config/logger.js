const winston = require('winston');
const config = require('./config');

const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
      winston.format.splat(),
      config.env === 'development' ?
          winston.format.colorize() :
          winston.format.uncolorize(),
  ),
  transports: [
    new winston.transports.File({filename: 'error.log', level: 'error'}),
    new winston.transports.File({filename: 'combined.log'}),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
      new winston.transports.Console({
        format: winston.format.simple(),
      }),
  );
}

module.exports = logger;
