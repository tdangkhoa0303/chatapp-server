const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  refreshToken: {
    type: String,
    required: true,
    trim: true,
  },
  accessToken: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    index: {
      expires: process.env.REFRESH_TOKEN_LIFE,
    },
    default: Date.now(),
  },
});

const Token = mongoose.model("Token", tokenSchema, "tokens");
module.exports = Token;
