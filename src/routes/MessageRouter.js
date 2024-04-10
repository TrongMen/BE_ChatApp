const express = require('express');
const { getMessages, sendMessage, sendUploadFile } = require('../contronllers/MessageController.js');
const { protectRoute } = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();

//----------Message----------
//[GET] http://localhost:3001/api/messages/:id
router.get('/:id', protectRoute, getMessages);
//[POST] http://localhost:3001/api/messages/send/:id  
router.post('/send/:id', protectRoute, sendMessage);

//----------UploadFile----------

//[POST] http://localhost:3001/api/messages/upload/:id
// 
router.post('/upload/:id', protectRoute, upload.single('file'), sendUploadFile);

module.exports = router;
