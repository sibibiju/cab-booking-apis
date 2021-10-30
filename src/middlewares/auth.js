const jwt = require('jsonwebtoken');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const verifyToken = (req, res, next) => {
  const token = req.get('Authorization');
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, httpStatus[httpStatus.UNAUTHORIZED]);
  }
  const payload = jwt.verify(token, config.jwt.secret);
  req.userId = payload.userId;
  next();
};

module.exports = verifyToken;
