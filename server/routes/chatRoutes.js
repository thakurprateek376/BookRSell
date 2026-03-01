const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Get all conversations for user
router.get('/conversations', chatController.getConversations);

// Get or create conversation
router.post('/conversation', chatController.getOrCreateConversation);

// Get messages for a conversation
router.get('/messages/:conversationId', chatController.getMessages);

// Send message
router.post('/message', chatController.sendMessage);

// Get unread message count
router.get('/unread-count', chatController.getUnreadCount);

// Close conversation
router.put('/conversation/:conversationId/close', chatController.closeConversation);

// Delete conversation
router.delete('/conversation/:conversationId', chatController.deleteConversation);

module.exports = router;
