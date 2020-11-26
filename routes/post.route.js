const router = require("express").Router();
const {
  getPosts,
  deletePost,
  createPost,
  reactPost,
  getPost,
} = require("../controllers/post.controller");

const multer = require("../middlewares/multer.middleware");

router.get("/", getPosts);

router.get("/single", getPost);

router.post("/", multer.array("images"), createPost);

router.get("/react/", reactPost);

router.patch("/:id", deletePost);

module.exports = router;
