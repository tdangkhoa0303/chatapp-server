const router = require("express").Router();
const {
  getPosts,
  deletePost,
  createPost,
  reactPost,
} = require("../controllers/post.controller");

router.get("/", getPosts);

router.post("/", createPost);

router.get("/react/", reactPost);

router.patch("/:id", deletePost);
