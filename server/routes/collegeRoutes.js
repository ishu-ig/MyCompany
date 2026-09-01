const express = require('express');
const router = express.Router();
const {
  getMyProfile,
  updateMyProfile,
  getAllColleges,
  submitTrainingRequest,
} = require('../controllers/collegeController');
const { protect } = require('../middleware/authMiddleware');

router.get('/me', protect, getMyProfile);
router.put('/me', protect, updateMyProfile);
router.post('/training-request', protect, submitTrainingRequest);

router.get('/', getAllColleges);

module.exports = router;
