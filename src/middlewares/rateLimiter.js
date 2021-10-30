const rateLimiter = require('express-rate-limit');

const limiter = rateLimiter({
  windowMs: 60 * 1000,
  max: 10,
});

module.exports = limiter;
