const Comment = require("../models/comment.model");
const Post = require("../models/post.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

module.exports.getPosts = catchAsync(async (req, res, next) => {
  const { p: page = 1 } = req.query;
  const perPage = process.env.PER_PAGE || 10;

  const posts = await Post.find()
    .limit(10)
    .skip((page - 1) * perPage);

  res.status(200).json({
    status: "succes",
    data: {
      posts,
    },
  });
});

module.exports.createPost = catchAsync(async (req, res, next) => {
  const { caption } = req.body;
  const authorId = req.jwtDecoded.data._id;

  // Validate comment content
  if (!content) return new AppError("Invalid post", 400);

  res.status(201).json({
    status: "success",
    data: {},
  });
});

module.exports.reactPost = catchAsync(async (req, res, next) => {
  const { post: postId } = req.query;
  const user = req.jwtDecoded.data;

  const post = await Post.findById(postId);

  if (!post) return new AppError("Invalid request params", 400);
  if (post.likes.includes(user._id))
    await Post.findByIdAndUpdate(postId, { $pull: { likes: user._id } });
  else
    await Post.findByIdAndUpdate(postId, {
      $addToSet: { likes: user._id },
    });
  res.status(200).json({
    status: "success",
  });
});

module.exports.deletePost = catchAsync(async (res, req, next) => {
  const { post: postId } = req.body;
  const user = req.jwtDecoded.data;

  const post = await Post.findById(postId);

  if (!post) return new AppError("Invalid request params", 400);

  if (post.author !== user._id) return new AppError("Unauthorized action", 403);

  const deletedPost = await Post.findByIdAndDelete(postId);

  res.status(200).json({
    status: "success",
    data: {
      post: deletedPost,
    },
  });
});
