const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../config/config');

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Number} expires
 * @param {string} type
 * @param {string} [secret]
 * @return {string}
 */
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    userId: userId,
    iat: moment().unix(),
    type,
  };
  return jwt.sign(payload, secret, {expiresIn: expires});
};

/**
 * Generate auth tokens
 * @param {User} user
 * @return {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
  const accessTokenExpires = config.jwt.accessTokenExpiryMins * 60;
  const tokenType = "AccessToken";
  const accessToken = generateToken(user._id, accessTokenExpires, tokenType);

  return {
    access: {
      token: accessToken,
      // expires: accessTokenExpires.toDate(),
    },
  };
};

module.exports = {
  generateToken,
  generateAuthTokens,
};
