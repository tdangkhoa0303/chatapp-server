const Comment = require("../models/comment.model");
const Post = require("../models/post.model");
const Notification = require("../models/notification.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { uploadImage } = require("../utils/media.utils");
const mongoose = require("mongoose");
const factory = require("../factory");
const { pushNotification } = require("../utils/user.utils");

module.exports.getPosts = catchAsync(async (req, res, next) => {
  try {
    const { p: page = 1 } = req.query;

    const posts = await factory.getPosts();
    res.status(200).json({
      status: "succes",
      data: {
        posts,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports.getPost = catchAsync(async (req, res, next) => {
  const { id } = req.query;

  const post = await factory.getPostById(id);

  res.status(200).json({
    status: "success",
    data: {
      post,
    },
  });
});

module.exports.createPost = catchAsync(async (req, res, next) => {
  const { caption, id } = req.body;
  const user = req.jwtDecoded.data;
  const paths = req.files.map((file) => file.path);

  const medias = await Promise.all(
    paths.map((path) => uploadImage(path, `posts/${id}`))
  );

  const fs = require("fs");
  paths.forEach((path) => fs.unlinkSync(path));

  // Validate comment content
  if (!caption) return new AppError("Invalid post", 400);

  let post = await Post.create({
    id: id,
    caption: caption,
    author: user._id,
    images: medias,
  });

  post = await factory.getPostById(post._id);

  res.status(201).json({
    status: "success",
    data: { post },
  });
});

module.exports.reactPost = catchAsync(async (req, res, next) => {
  try {
    const { post: postId } = req.query;
    const user = req.jwtDecoded.data;

    const post = await Post.findById(postId);

    if (!post) return new AppError("Invalid request params", 400);

    // Check if user's liked this post yet
    let likes = post.likes;
    const index = likes.findIndex((id) => id.toString() === user._id);
    if (index >= 0)
      likes = [...likes.slice(0, index), ...likes.slice(index + 1)];
    else {
      likes.push(user._id);

      // Add new notification to post's author
      if (user._id !== post.author.toString()) {
        // Push notification to uset
        const data = {
          to: post.author,
          author: user._id,
          action: "liked your post.",
          path: post._id,
        };

        const io = res.locals.io;

        pushNotification(io, data);
      }
    }

    await Post.findByIdAndUpdate(postId, {
      likes,
    });

    res.status(200).json({
      status: "success",
    });
  } catch (err) {
    console.log(err);
  }
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
