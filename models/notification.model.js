const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: { type: String, required: true, trim: true },

    status: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const Notification = mongoose.model(
  "Notification",
  NotificationSchema,
  "notifications"
);

module.exports = Notification;
