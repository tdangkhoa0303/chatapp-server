const router = require("express").Router();
const { searchUsers } = require("../controllers/user.controller");

router.get("/search", searchUsers);

module.exports = router;
