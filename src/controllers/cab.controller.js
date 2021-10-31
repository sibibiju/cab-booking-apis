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

const bookCab = catchAsync(async (req, res, next) => {
  const cabId = req.body.cabId;
  const isValid = mongoose.Types.ObjectId.isValid(cabId);

  if (!isValid) {
    const message = httpStatus[httpStatus.BAD_REQUEST];
    return next(new ApiError(httpStatus.BAD_REQUEST, message));
  }

  const cab = await Cab.findOne({_id: cabId}).exec();
  if (!cab) {
    return next(new ApiError(httpStatus.NOT_FOUND, httpStatus[httpStatus.NOT_FOUND]));
  }

  if (cab.status === 'NA') {
    return next(new ApiError(405, 'Failed to book the provided cab.'));
  }

  const filter = {_id: cabId};
  const response = await Cab.updateOne(filter, {$set: {status: 'NA'}}).exec();

  if (response.acknowledged) {
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

    res.send({'bookingStatus': 'success'}).status(200);
  }

  return next(new ApiError(500, 'Something went wrong while processing the request'));
});

module.exports = {
  getCabs,
  bookCab,
};
