const mongoose = require('mongoose');
const Cab = require('./cab.model');

const bookingHistorySchema = mongoose.Schema(
    {
      userId: {
        type: String,
        required: true,
      },
      cab: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Cab,
        required: true,
      },
      fare: {
        type: String,
      },
      distance: {
        type: Number,
      },
    },
    {
      timestamps: true,
    },
);

const History = mongoose.model('BookingHistory', bookingHistorySchema);
module.exports = History;
