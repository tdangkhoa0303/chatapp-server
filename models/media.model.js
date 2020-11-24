const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
  public_id: {
    type: String,
    required: true,
  },

  url: {
    type: String,
    required: true,
    trim: true,
  },
});

const Media = mongoose.model("Media", mediaSchema, "medias");

module.exports = Media;
