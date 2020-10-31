const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  conservationId: {
    type: mongoose.Schema.ObjectId,
    ref: "Conversation",
    required: true,
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  at: {
    type: Date,
    required: true,
  },
  seen: {
    type: Boolean,
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
});

const Message = mongoose.model("Message", messageSchema, "messages");

module.exports = Message;
