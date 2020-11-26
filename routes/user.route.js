const router = require("express").Router();
const { searchUsers, getProfile } = require("../controllers/user.controller");

router.get("/search", searchUsers);

router.get("/profile", getProfile);

module.exports = router;
