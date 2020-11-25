const router = require("express").Router();
const {
  getPosts,
  deletePost,
  createPost,
  editPost,
  reactPost,
} = require("../controllers/post.controller");

router.get("/");
