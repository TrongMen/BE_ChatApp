const express = require("express");
const { getMessages, sendMessage } = require("../contronllers/MessageController.js");
const { protectRoute } = require("../middleware/authMiddleware");

const router = express.Router();
//[GET] http://localhost:3001/api/messages//:id
router.get("/:id", protectRoute, getMessages);
//[POST] http://localhost:3001/api/messages/send/:id
router.post("/send/:id", protectRoute, sendMessage);

module.exports = router;
