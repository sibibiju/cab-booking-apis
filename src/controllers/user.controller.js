const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const toJsonApi = require('../utils/toJsonApi');
const tokenService = require('../services/token.service');
const authService = require('../services/auth.service');
const History = require('../models/history.model');

/**
 * Middleware for login & getting user details & accesstoken
 */
const login = catchAsync(async (req, res) => {
  const {email, password} = req.body;
  const user = await authService.login(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  const response = toJsonApi({user, tokens}, 'user');
  res.send(response);
});

/**
 * Middleware for booking history
 */
const getBookingHistory = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const bookingHistory = await History.find({userId: userId})
      .limit(10)
      .populate('cab', {_id: 1, driver: 1, car: 1});
  return res.send(toJsonApi(bookingHistory, 'booking-history'));
});

module.exports = {
  getBookingHistory,
  login,
};
