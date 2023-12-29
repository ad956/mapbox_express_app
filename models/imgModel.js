const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imgModel = new Schema({
  uploader: {
    type: String,
    required: true,
  },
  imgName: {
    type: String,
    // required: true,
  },

  imgUrl: {
    type: String,
    // required: true,
  },
});

module.exports = mongoose.model("Images", imgModel);
