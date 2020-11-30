const Comment = require("../models/comment.model");
const Notification = require("../models/notification.model");
const Post = require("../models/post.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { getNotifications } = require("../factory");
const { pushNotification } = require("../utils/user.utils");

module.exports.addComment = catchAsync(async (req, res, next) => {
  try {
    let { postId, comment } = req.body;
    const authorId = req.jwtDecoded.data._id;

    // Validate comment content
    if (!comment.content) return new AppError("Invalid comment", 400);

    const post = await Post.findById(postId);
    if (!post) return new AppError("Invalid post", 404);

    comment = await Comment.create({
      ...comment,
      post: postId,
      author: authorId,
    });

    await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });

    // Add new notification to post's author
    if (authorId !== post.author.toString()) {
      const data = {
        to: post.author,
        author: authorId,
        action: `commented: ${comment.content}`,
        path: post._id,
      };

      const io = res.locals.io;

      pushNotification(io, data);
    }

    res.status(201).json({
      status: "success",
      data: {
        comment,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports.reactComment = catchAsync(async (req, res, next) => {
  const { comment: commentId } = req.query;
  const user = req.jwtDecoded.data;

  const comment = await Comment.findById(commentId);

  if (!comment) return new AppError("Invalid request params", 400);
  if (comment.likes.includes(user._id))
    await Comment.findByIdAndUpdate(commentId, { $pull: { likes: user._id } });
  else
    await Comment.findByIdAndUpdate(commentId, {
      $addToSet: { likes: user._id },
    });
  res.status(200).json({
    status: "success",
  });
});

module.exports.deleteComment = catchAsync(async (res, req, next) => {
  const { comment: commentId } = req.body;
  const user = req.jwtDecoded.data;

  const comment = await Comment.findById(commentId);

  if (!comment) return new AppError("Invalid request params", 400);

  if (comment.author !== user._id)
    return new AppError("Unauthorized action", 403);

  const deletedComment = await Comment.findByIdAndDelete(commentId);

  res.status(200).json({
    status: "success",
    data: {
      comment: deletedComment,
    },
  });
});

module.exports.fetchNotifications = catchAsync(async (req, res, next) => {
  const { p: page = 1 } = req.query;

  const user = req.jwtDecoded.data;

  const notifications = await getNotifications(user, page);

  res.status(200).json({
    status: "succes",
    data: {
      notifications,
    },
  });
});

module.exports.toggleNoticationStatus = catchAsync(async (req, res, next) => {
  try {
    const { n: id, status } = req.query;

    const notification = await Notification.findById(id);

    if (!notification) return new AppError("Invalid request params", 400);

    const seen = await Notification.findByIdAndUpdate(id, {
      status: status === "undefined" ? !notification.status : status,
    });

    res.status(200).json({
      status: "success",
      data: {
        notification: seen,
      },
    });
  } catch (err) {
    console.log(err);
  }
});
