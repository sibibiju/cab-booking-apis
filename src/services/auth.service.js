const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const User = require('../models/user.model');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @return {Promise<User>}
 */
const login = async (email, inputPassword) => {
  const user = await User.findOne({email: email}).exec();
  if (!user || !(await user.isPasswordMatch(inputPassword, user.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

module.exports = {
  login,
};
