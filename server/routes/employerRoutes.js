const express = require('express');
const router = express.Router();
const {
  getMyProfile,
  updateMyProfile,
  getAllEmployers,
  getEmployerById,
  getEmployerStats,
} = require('../controllers/employerController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/me', protect, getMyProfile);
router.put('/me', protect, updateMyProfile);
router.get('/dashboard/stats', protect, authorize('employer', 'admin'), getEmployerStats);

router.get('/', getAllEmployers);
router.get('/:id', getEmployerById);

module.exports = router;
