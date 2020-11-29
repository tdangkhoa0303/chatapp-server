const { Mongoose } = require("mongoose");
const Notification = require("../models/notification.model");
const User = require("../models/user.model");

const basicDetails = (user) => {
  const { _id, name, email, avatar, fullName, bio, nickName } = user;
  return { _id, name, email, avatar, fullName, bio, nickName };
};

module.exports = { basicDetails };
