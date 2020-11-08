const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      trim: true,
    },
    conversation: {
      type: mongoose.Schema.ObjectId,
      ref: "Conversation",
      required: true,
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema, "messages");

module.exports = Message;
