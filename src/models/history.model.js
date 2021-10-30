const mongoose = require('mongoose');

const bookingHistorySchema = mongoose.Schema(
    {
      userId: {
        type: String,
        required: true,
      },
      cab: {
        type: String,
        required: true,
      },
      fare: {
        type: Number,
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
