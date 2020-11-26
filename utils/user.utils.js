const { Mongoose } = require("mongoose");
const Notification = require("../models/notification.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");

const basicDetails = (user) => {
  const { _id, name, email, avatar, fullName, bio, nickName } = user;
  return { _id, name, email, avatar, fullName, bio, nickName };
};

const getNotifications = async (user, page = 1) => {
  const perPage = process.env.PER_PAGE || 10;

  const notifications = await Notification.find({ to: user._id })
    .populate({
      path: "author",
      select: "fullName _id nickName avatar firstName lastName",
      populate: {
        path: "avatar",
        select: "url",
      },
    })
    .limit(10)
    .skip((page - 1) * perPage);

  return notifications;
};

module.exports = { basicDetails, getNotifications };
