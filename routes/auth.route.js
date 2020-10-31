const express = require("express");
const {
  logIn,
  signUp,
  refreshToken,
} = require("../controllers/auth.controller");

const router = express.Router();

router.route("/login").post(logIn);

router.route("/signup").post(signUp);

router.route("/refreshToken").post(refreshToken);

module.exports = router;
