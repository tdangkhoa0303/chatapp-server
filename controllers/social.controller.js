const Comment = require("../models/comment.model");
const Post = require("../models/post.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

module.exports.addComment = catchAsync(async (req, res, next) => {
  const { postId, content } = req.body;
  const authorId = req.jwtDecoded.data._id;

  // Validate comment content
  if (!content) return new AppError("Invalid comment", 400);

  const post = await Post.findById(postId);
  if (!post) return new AppError("Invalid post", 404);

  const comment = Comment.create({
    post: post._id,
    author: authorId,
    content: content,
  });

  res.status(201).json({
    status: "success",
    data: {
      comment,
    },
  });
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
