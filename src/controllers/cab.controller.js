const httpStatus = require('http-status');
const getDistance = require('../utils/distance');
const Cab = require('../models/cab.model');
const catchAsync = require('../utils/catchAsync');
const toJsonApi = require('../utils/toJsonApi');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const History = require('../models/history.model');
const faker = require('faker');
const mongoose = require('mongoose');

/**
 * Middleware for fetching & sending the available cabs based on location
 */
const getCabs = catchAsync(async (req, res, next) => {
  const currentLocation = {};
  currentLocation.latitude = req.query.latitude;
  currentLocation.longitude = req.query.longitude;

  let cabs = await Cab.find({status: 'available'}).limit(5).exec();
  cabs = cabs.filter((cab) => {
    // eslint-disable-next-line max-len
    if (getDistance(currentLocation, cab.currentLocation) < config.min_distance) {
      return true;
    }
  });
  cabs = toJsonApi(cabs, 'cabs');
  res.send(cabs);
});

/**
 * Middleware for booking the available cab
 */
const bookCab = catchAsync(async (req, res, next) => {
  // Check if the cabId provided is valid mongoDB ID
  const cabId = req.body.cabId;
  const isValid = mongoose.Types.ObjectId.isValid(cabId);
  let code;
  let message;

  if (!isValid) {
    message = httpStatus[httpStatus.BAD_REQUEST];
    code = httpStatus.BAD_REQUEST;
    return next(new ApiError(code, message));
  }

  const cab = await Cab.findOne({_id: cabId}).exec();
  if (!cab) {
    code = httpStatus.NOT_FOUND;
    message = httpStatus[httpStatus.NOT_FOUND];
    return next(new ApiError(code, message));
  }

  // If a cab is already booked it cannot be booked by other user
  if (cab.status === 'NA') {
    message = 'Failed to book the provided cab.';
    return next(new ApiError(405, message));
  }

  // Update the cab's status
  const filter = {_id: cabId};
  const response = await Cab.updateOne(filter, {$set: {status: 'NA'}}).exec();

  if (response.acknowledged) {
    // Adding entry to booking history collection
    const id = cab._id.toString();
    const userId = req.userId;
    const fare = faker.datatype.number({min: 100, max: 2000}) + '$';
    const distance = faker.datatype.number({min: 1, max: 20});
    const doc = {
      userId: userId,
      cab: id,
      fare: fare,
      distance: distance,
    };

    new History(doc).save((err, doc) => {
      if (err) return next(err);
    });

    return res.send({'bookingStatus': 'success'}).status(200);
  }

  message = 'Something went wrong while processing the request';
  return next(new ApiError(500, message));
});

module.exports = {
  getCabs,
  bookCab,
};
