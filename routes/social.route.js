const router = require("express").Router();
const {
  addComment,
  reactComment,
  deleteComment,
} = require("../controllers/social.controller");

router.post("/", addComment);

router.get("/react/", reactComment);

router.patch("/:id", deleteComment);
