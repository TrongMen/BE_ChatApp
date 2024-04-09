
const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');

const upload = multer({ dest: 'uploads/' });
const messageSchema = new mongoose.Schema({
    content: String, 
    fileData: Buffer, 
    imageData: Buffer,
   
});
const Message = mongoose.model('Message', messageSchema);
const router = express.Router();

router.post('/send-message', upload.fields([{ name: 'file', maxCount: 1 }, { name: 'image', maxCount: 1 }]), async (req, res) => {
    try {
        const content = req.body.content;
        const file = req.files['file'] ? req.files['file'][0] : null;
        const image = req.files['image'] ? req.files['image'][0] : null;

        const newMessage = new Message({
            content: content,
            fileData: file ? file.buffer : null,
            imageData: image ? image.buffer : null,
        });

        await newMessage.save();

        return res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
