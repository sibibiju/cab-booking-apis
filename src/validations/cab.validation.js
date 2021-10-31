const Joi = require('joi');

const nearByCabsSchema = Joi.object({
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
});

const bookCabSchema = Joi.object({
  cabId: Joi.string().required().trim(),
});

module.exports = {
  nearByCabsSchema,
  bookCabSchema,
};
