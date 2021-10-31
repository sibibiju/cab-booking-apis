const httpStatus = require('http-status');
const Joi = require('joi');
const Schemas = require('../validations');
const ApiError = require('../utils/ApiError');

const validator = (schemaName, property = 'body') => async (req, res, next) => {
  if (!Schemas.hasOwnProperty(schemaName)) {
    const code = httpStatus.INTERNAL_SERVER_ERROR;
    return next(new ApiError(code, `'${schemaName}' is not valid`));
  }

  try {
    const validated = await Schemas[schemaName].validateAsync(req[property]);
    req[property] = validated;
    return next();
  } catch (err) {
    if (err.isJoi) {
      return next(new ApiError(httpStatus.BAD_REQUEST, err.message));
    } else {
      return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message));
    }
  }
};

module.exports = validator;
