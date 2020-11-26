const Post = require("./models/post.model");
const User = require("./models/user.model");
const Notification = require("./models/notification.model");
const { query } = require("express");

const ObjectId = require("mongoose").Types.ObjectId;

module.exports.getPosts = (page, author) => {
  const perPage = process.env.PER_PAGE || 10;
  const query = {};
  if (author) query.author = author;
  return Post.find(query)
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
