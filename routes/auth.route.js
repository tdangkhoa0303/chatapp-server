const express = require("express");
const {
  logIn,
  signUp,
  refreshToken,
} = require("../controllers/auth.controller");

const router = express.Router();
const multer = require("../middlewares/multer.middleware");

router.route("/login").post(logIn);

router.post("/signup", multer.single("avatar"), signUp);

router.route("/refreshToken").post(refreshToken);

module.exports = router;
