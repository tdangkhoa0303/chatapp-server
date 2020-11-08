const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        required: true,
      },
    ],
    name: {
      type: String,
      trim: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model(
  "Conversation",
  conversationSchema,
  "conversations"
);

module.exports = Conversation;
