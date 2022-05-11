const mongoose = require("mongoose");

const Event = mongoose.model(
  "Events",
  new mongoose.Schema({
    title: {
      type: String,
      trim: true,
      required: true
    },
    startDate: {
<<<<<<< HEAD
        type: String,
        time: true,
        required: true
    },
    endDate: {
        type: String,
        trim: true,
        required: true
=======
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
>>>>>>> fbbddf82abf0b38380d2c7be346d3584ffae4d8d
    },
    creator: {
      type: mongoose.ObjectId,
      required: true
    },
    days: {
      type: {},
      default: null
    }
  })
);

module.exports = Event;