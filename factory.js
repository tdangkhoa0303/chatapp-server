const Post = require("./models/post.model");
const User = require("./models/user.model");
const Notification = require("./models/notification.model");
const Conversation = require("./models/conversation.model");

const perPage = process.env.PER_PAGE || 10;

const ObjectId = require("mongoose").Types.ObjectId;

module.exports.getPosts = (page, author) => {
  const perPage = process.env.PER_PAGE || 10;
  const query = {};
  if (author) query.author = author;
  return Post.find(query)
    .sort({ _id: -1 })
    .limit(10)
    .skip((page - 1) * perPage)
    .populate([
      {
        path: "images",
        select: "url",
      },
      {
        path: "comments",
        populate: {
          path: "author",
          select: "fullName _id nickName avatar firstName lastName",
        },
      },
      {
        path: "author",
        select: "fullName _id nickName avatar firstName lastName",
        populate: {
          path: "avatar",
          select: "url",
        },
      },
    ]);
};

module.exports.getPostById = (id) =>
  Post.findById(id).populate([
    {
      path: "images",
      select: "url",
    },
    {
      path: "comments",
      populate: {
        path: "author",
        select: "fullName _id nickName avatar firstName lastName",
      },
    },
    {
      path: "author",
      select: "fullName _id nickName avatar firstName lastName",
      populate: {
        path: "avatar",
        select: "url",
      },
    },
  ]);

module.exports.getNotifications = (user, page = 1) =>
  Notification.find({ to: user._id })
    .sort({ _id: -1 })
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

module.exports.getConversations = (user, page = 1) =>
  Conversation.find({
    members: user._id,
  })
    .limit(perPage)
    .skip(perPage * (page - 1))
    .sort({ updatedAt: -1 })
    .populate([
      {
        path: "members",
        select: "fullName _id email avatar firstName lastName",
        populate: {
          path: "avatar",
          select: "url",
        },
      },
      { path: "messages" },
    ]);
module.exports.queryUser = (q) => {
  let query = {};
  if (ObjectId.isValid(q)) {
    query._id = q;
  } else query.nickName = q;

  return User.findOne({
    ...query,
  }).populate({
    path: "avatar",
    select: "url",
  });
};
