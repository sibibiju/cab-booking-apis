/* eslint-disable valid-jsdoc */
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');
const logger = require('../config/logger');

/**
 * Convert the error to a standard format
 * @param {object} err error object
 * @param {object} req request object
 * @param {object} res response object
 * @param {object} next
 */
const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof Error)) {
    const statusCode = error.statusCode || error instanceof mongoose.Error ?
        httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;

    const message = error.message ||
        httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
    error = new ApiError(statusCode, message, false, err.stack);
  } else if (!error.statusCode) {
    error.statusCode = 500;
  }

  logger.error(error);
  next(error);
};

/**
 * Error handler for the app
 * @param {object} err error object
 * @param {object} req request object
 * @param {object} res response object
 * @param {object} next
 */
const errorHandler = (err, req, res, next) => {
  let {statusCode, message} = err;

  if (config.env === 'production' && !err.is_operational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  const response = {
    errors: [{
      code: statusCode,
      message: message,
    }],
  };

  if (config.env === 'development' && err.stack) {
    response.errors[0].stack = err.stack;
  }

  logger.error(err);
  res.status(statusCode).send(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};
