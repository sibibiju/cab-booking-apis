const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

let server;
mongoose.connect(config.mongodb.url, config.mongodb.options).then(() => {
  logger.info('Connected to MongoDB database');
  // Run the app only after connecting to Database
  server = app.listen(config.port, () => {
    logger.info(`Application running on port: ${config.port} `);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.error('Server closed due to some unexpected errors');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const errorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', errorHandler);
process.on('unhandledRejection', errorHandler);
