/* eslint-disable max-len */
const tokenService = require('../../src/services/token.service');

const generateToken = async () => {
  const userId = '617d307a519ae488184baa81';
  const data = await tokenService.generateAuthTokens({_id: userId});
  const token = data.access.token;

  return token;
};

module.exports = generateToken;
