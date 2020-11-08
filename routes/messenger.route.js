const router = require("express").Router();
const {
  getConversations,
  getSingleConversation,
  getConversationById,
  seenConversation,
} = require("../controllers/messenger.controller");
/*
- GET /                                 10 recent conversations
- GET /:username|userId                 get conversastion by username
- GET /search                           search user and their conversations
- DELETE /:id                           delete a conversation with id
  
*/
router.get("/", getConversations);

router.get("/:q", getSingleConversation);

router.post("/id", getConversationById);

router.post("/conversation", seenConversation);

module.exports = router;
