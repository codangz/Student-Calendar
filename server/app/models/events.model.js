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
      type: String,
      trim: true,
      required: true
    },
    endDate: {
      type: String,
      trim: true,
      required: true
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

/*
  new mongoose.Schema({
    title: {
      type: String,
      trim: true,
      required: true
    },
    nonrecurring: {
      
    },
    recurring: {
      
    },
    startDate: {
      type: String,
      trim: true,
      required: true
    },
    endDate: {
      type: String,
      trim: true,
      required: true
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
*/

module.exports = Event;