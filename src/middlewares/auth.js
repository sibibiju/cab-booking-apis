const jwt = require('jsonwebtoken');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

/*
 * Middleware for verifying the JWT token
 */
const verifyToken = (req, res, next) => {
  const token = req.get('Authorization');
  if (!token) {
    const code = httpStatus.UNAUTHORIZED;
    const message = httpStatus[httpStatus.UNAUTHORIZED];
    return next(new ApiError(code, message));
  }
  const payload = jwt.verify(token, config.jwt.secret);
  req.userId = payload.userId;
  next();
};

module.exports = verifyToken;
