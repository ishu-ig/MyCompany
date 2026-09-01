const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Get or create conversation with another user
// @route   POST /api/messages/conversation
// @access  Private
const getOrCreateConversation = async (req, res, next) => {
  try {
    const { receiverId } = req.body;
    if (!receiverId) {
      return sendError(res, 'Receiver ID is required', 400);
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, receiverId] },
    }).populate('participants', 'name email avatar role');

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, receiverId],
        lastMessage: 'Conversation started',
      });
      conversation = await Conversation.findById(conversation._id).populate('participants', 'name email avatar role');
    }

    return sendSuccess(res, 'Conversation retrieved', conversation);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's conversations
// @route   GET /api/messages/conversations
// @access  Private
const getMyConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate('participants', 'name email avatar role')
      .sort({ updatedAt: -1 });

    return sendSuccess(res, 'Conversations retrieved', conversations);
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages in a conversation
// @route   GET /api/messages/:conversationId
// @access  Private
const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ conversation: req.params.conversationId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });

    // Mark unread messages received by this user as read
    await Message.updateMany(
      { conversation: req.params.conversationId, receiver: req.user._id, isRead: false },
      { isRead: true }
    );

    return sendSuccess(res, 'Messages retrieved', messages);
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res, next) => {
  try {
    const { conversationId, receiverId, message, attachment } = req.body;

    if (!message || (!conversationId && !receiverId)) {
      return sendError(res, 'Message text and conversation or receiver ID are required', 400);
    }

    let convId = conversationId;
    if (!convId && receiverId) {
      let conv = await Conversation.findOne({
        participants: { $all: [req.user._id, receiverId] },
      });
      if (!conv) {
        conv = await Conversation.create({
          participants: [req.user._id, receiverId],
        });
      }
      convId = conv._id;
    }

    const conv = await Conversation.findById(convId);
    const targetReceiver = receiverId || conv.participants.find((p) => p.toString() !== req.user._id.toString());

    const newMessage = await Message.create({
      conversation: convId,
      sender: req.user._id,
      receiver: targetReceiver,
      message,
      attachment: attachment || '',
    });

    await Conversation.findByIdAndUpdate(convId, {
      lastMessage: message,
      lastMessageAt: new Date(),
    });

    const populated = await Message.findById(newMessage._id).populate('sender', 'name avatar');
    return sendSuccess(res, 'Message sent successfully', populated, 201);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrCreateConversation,
  getMyConversations,
  getMessages,
  sendMessage,
};
