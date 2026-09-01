const express = require('express');
const router = express.Router();
const {
  createRecruitmentRequest,
  getRecruitmentRequests,
  updateRecruitmentRequestStatus,
} = require('../controllers/recruitmentRequestController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getRecruitmentRequests);
router.post('/', protect, authorize('employer', 'admin'), createRecruitmentRequest);
router.patch('/:id/status', protect, authorize('recruiter', 'admin'), updateRecruitmentRequestStatus);

module.exports = router;
