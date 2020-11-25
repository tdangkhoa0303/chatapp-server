const router = require("express").Router();
const {
  addComment,
  reactComment,
  deleteComment,
  fetchNotifications,
  toggleNoticationStatus,
} = require("../controllers/social.controller");

router.post("/", addComment);

router.get("/react/", reactComment);

router.get("/notifications", fetchNotifications);

router.get("/notification", toggleNoticationStatus);

router.patch("/:id", deleteComment);

module.exports = router;
