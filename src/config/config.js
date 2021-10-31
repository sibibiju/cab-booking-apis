const dotenv = require('dotenv');
const Joi = require('joi');
const path = require('path');

const envPath = path.join(__dirname, '../../.env');
dotenv.config({path: envPath});

const envSchema = Joi.object().keys({
  NODE_ENV: Joi.string().default('development'),
  PORT: Joi.number().required().default(3000),
  MONGODB_URL: Joi.string().required().description('MongoDB URL - Database'),
  JWT_SECRET: Joi.string().required().description('JWT secret'),
  JWT_ACCESS_EXPIRY_MINS: Joi.number().default(60)
      .description('Access token expires after the configured minutes'),
  JWT_REFRESH_EXPIRY_DAYS: Joi.number().default(10)
      .description('Refresh token expires after the configured days'),
  MIN_DISTANCE: Joi.number().default(400),
}).unknown();

const {value: envVars, error} = envSchema.validate(process.env);
if (error) {
  throw new Error(`Invalid/Empty configuration provided: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  min_distance: envVars.MIN_DISTANCE,
  mongodb: {
    url: envVars.MONGODB_URL,
    options: {},
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessTokenExpiryMins: envVars.JWT_ACCESS_EXPIRY_MINS,
    refreshTokenExpiryDays: envVars.JWT_REFRESH_EXPIRY_DAYS,
  },
};
