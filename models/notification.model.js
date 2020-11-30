const { request } = require("express");
const mongoose = require("mongoose");
const Socket = require("../socket");
const events = require("../socket/events");

const NotificationSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: { type: String, required: true, trim: true },

    status: { type: Boolean, required: true, default: false },

    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // If action is PEOPLE type, action url will be the author profile
    path: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model(
  "Notification",
  NotificationSchema,
  "notifications"
);

module.exports = Notification;

// PEOPLE type: actions like follow, send follow request, so on.
