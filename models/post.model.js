const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Media",
        required: true,
      },
    ],

    caption: {
      type: String,
      required: true,
      trim: true,
    },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],

    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema, "posts");

module.exports = Post;
