const events = require("../socket/events");
const Notification = require("../models/notification.model");
const _ = require("underscore");

const basicDetails = (user) => {
  const { _id, name, email, avatar, fullName, bio, nickName } = user;
  return { _id, name, email, avatar, fullName, bio, nickName };
};

const pushNotification = async (io, data) => {
  const nsp = io.of("/messenger");

  let notification = await Notification.create(data);
  notification = await Notification.findById(notification._id).populate({
    path: "author",
    select: "fullName _id nickName avatar firstName lastName",
    populate: {
      path: "avatar",
      select: "url",
    },
  });

  if (
    (_.findWhere(nsp.sockets),
    {
      userId: notification.to.toString(),
    })
  ) {
    console.log("ad");
    nsp.to(notification.to.toString()).emit(events.NOTIFY, notification);
  }
};

module.exports = { basicDetails, pushNotification };
