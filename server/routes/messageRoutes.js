const express = require('express');
const router = express.Router();
const {
  getOrCreateConversation,
  getMyConversations,
  getMessages,
  sendMessage,
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.post('/conversation', protect, getOrCreateConversation);
router.get('/conversations', protect, getMyConversations);
router.get('/:conversationId', protect, getMessages);
router.post('/', protect, sendMessage);

module.exports = router;
