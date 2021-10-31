const userValidationSchema = require('./user.validation');
const cabValidationSchema = require('./cab.validation');

module.exports = {
  ...userValidationSchema,
  ...cabValidationSchema,
};
