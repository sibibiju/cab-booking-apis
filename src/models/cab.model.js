const mongoose = require('mongoose');

const locationSchema = mongoose.Schema(
    {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    {_id: false},
);

const driverSchema = mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      licenseNumber: {
        type: String,
        required: true,
        trim: true,
      },
    },
    {_id: false},
);

const carSchema = mongoose.Schema(
    {
      model: {
        type: String,
        required: true,
        trim: true,
      },
      licensePlate: {
        type: String,
        required: true,
      },
    },
    {_id: false},
);

const cabSchema = mongoose.Schema(
    {
      currentLocation: {
        type: locationSchema,
        required: true,
      },
      driver: {
        type: driverSchema,
        required: true,
      },
      car: {
        type: carSchema,
        required: true,
      },
      status: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    },
);

const Cab = mongoose.model('Cab', cabSchema);
module.exports = Cab;
