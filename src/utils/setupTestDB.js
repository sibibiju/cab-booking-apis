const mongoose = require('mongoose');
const config = require('../../src/config/config');

const setupTestDB = () => {
  beforeAll(async () => {
    await mongoose.connect(config.mongodb.url, config.mongodb.options);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
};

module.exports = setupTestDB;
