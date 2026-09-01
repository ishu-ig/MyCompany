const express = require('express');
const router = express.Router();
const {
  getMyProfile,
  updateMyProfile,
  getAllTrainers,
  getTrainerDashboardStats,
} = require('../controllers/trainerController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/me', protect, getMyProfile);
router.put('/me', protect, updateMyProfile);
router.get('/dashboard/stats', protect, authorize('trainer', 'admin'), getTrainerDashboardStats);

router.get('/', getAllTrainers);

module.exports = router;
