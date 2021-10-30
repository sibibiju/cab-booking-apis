const faker = require('faker');
const User = require('../models/user.model');
const config = require('../config/config');
const mongoose = require('mongoose');
const logger = require('../config/logger');

const data = {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: 'Random@123',
};

const users = [new User(data)];
mongoose.connect(config.mongodb.url)
    .catch((err) => {
      logger.info(err.stack);
    })
    .then(() => {
      logger.info('Connected to MongoDB in seeder');

      users.map(async (userObj, index) => {
        await userObj.save((err, result) => {
          if (err) logger.error(err);
          if (result) logger.info(result);
          if (index === users.length - 1) {
            logger.info('Done seeding.');
            mongoose.disconnect();
          }
        });
      });
    });
