const router = require("express").Router();
const {
  getConversations,
  getSingleConversation,
} = require("../controllers/messenger.controller");
/*
- GET /                                 10 recent conversations
- GET /:username|userId                 get conversastion by username
- GET /search                           search user and their conversations
- DELETE /:id                           delete a conversation with id
  
*/
router.post("/", getConversations);

router.get("/:q", getSingleConversation);

module.exports = router;
