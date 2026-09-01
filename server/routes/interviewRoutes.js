const express = require('express');
const router = express.Router();
const {
  scheduleInterview,
  getInterviews,
  getInterviewById,
  updateInterviewStatus,
} = require('../controllers/interviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getInterviews);
router.get('/:id', protect, getInterviewById);
router.post('/', protect, authorize('employer', 'recruiter', 'admin'), scheduleInterview);
router.patch('/:id/status', protect, authorize('employer', 'recruiter', 'admin'), updateInterviewStatus);

module.exports = router;
