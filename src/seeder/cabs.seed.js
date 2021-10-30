const faker = require('faker');
const Cab = require('../models/cab.model');
const config = require('../config/config');
const mongoose = require('mongoose');
const logger = require('../config/logger');

const data = {
  currentLocation: {
    latitude: faker.address.latitude(20, 18),
    longitude: faker.address.longitude(72, 74),
  },
  driver: {
    name: faker.name.findName(),
    licenseNumber: faker.random.alphaNumeric(10),
  },
  car: {
    model: faker.vehicle.model(),
    licensePlate: faker.datatype.number(4),
  },
};

const cabs = [new Cab(data)];
mongoose.connect(config.mongodb.url)
    .catch((err) => {
      logger.info(err.stack);
    })
    .then(() => {
      logger.info('Connected to MongoDB in seeder');

      cabs.map(async (cabObj, index) => {
        await cabObj.save((err, result) => {
          if (index === cabs.length - 1) {
            logger.info('Done seeding.');
            mongoose.disconnect();
          }
        });
      });
    });
