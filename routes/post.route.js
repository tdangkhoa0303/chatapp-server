const router = require("express").Router();
const {
  getPosts,
  deletePost,
  createPost,
  reactPost,
} = require("../controllers/post.controller");

const multer = require("../middlewares/multer.middleware");

router.get("/", getPosts);

router.post("/", multer.array("images"), createPost);

router.get("/react/", reactPost);

router.patch("/:id", deletePost);

module.exports = router;
