const express = require("express");
const { getMessages, sendMessage } = require("../contronllers/MessageController.js");
const { protectRoute } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

module.exports = router;
