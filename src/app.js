const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const mongoSanitize = require('express-mongo-sanitize');
// const routes = require('./routes/v1');
const config = require('./config/config');
const morgan = require('./config/morgan');
const ApiError = require('./utils/ApiError');
const {errorHandler, errorConverter} = require('./middlewares/error');

const app = express();
// set security headers
app.use(helmet());

// sanitize the data
app.use(xss());
app.use(mongoSanitize());

app.use(cors());
app.options('*', cors());

// parse JSON
app.use(express.json());

// parse URL encoded request
app.use(express.urlencoded({extended: true}));
// app.use('/v1', routes);

// send 404 API error for undefined API endpoints
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, httpStatus[httpStatus.NOT_FOUND]));
});

// Convert errors to standard format
app.use(errorConverter);

// Handle errors
app.use(errorHandler);

module.exports = app;
