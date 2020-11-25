const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      required: true,
      trim: true,
    },

    likes: { type: Number, default: 0, required: true },

    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],

    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema, "posts");

module.exports = Post;
