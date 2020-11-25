const Comment = require("../models/comment.model");
const Post = require("../models/post.model");
const Notification = require("../models/notification.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { uploadImage } = require("../utils/media.utils");
const mongoose = require("mongoose");

module.exports.getPosts = catchAsync(async (req, res, next) => {
  const { p: page = 1 } = req.query;
  const perPage = process.env.PER_PAGE || 10;

  try {
    const posts = await Post.find()
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

module.exports.createPost = catchAsync(async (req, res, next) => {
  try {
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

    const post = await Post.create({
      id: id,
      caption: caption,
      author: user._id,
      images: medias,
    });

    res.status(201).json({
      status: "success",
      data: { post },
    });
  } catch (err) {
    console.log(err);
  }
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
      if (user._id !== post.author.toString())
        await Notification.create({
          to: post.author,
          author: user._id,
          action: "liked your post.",
          path: post._id,
        });
    }
    console.log(likes);
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