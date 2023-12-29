const mongoose = require("mongoose");

const geoModel = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

module.exports = mongoose.model("GeoModel", geoModel);
