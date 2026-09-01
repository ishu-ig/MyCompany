const express = require('express');
const router = express.Router();
const {
  createPlacement,
  getPlacements,
  getPlacementById,
  updatePlacementStatus,
} = require('../controllers/placementController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getPlacements);
router.get('/:id', protect, getPlacementById);
router.post('/', protect, authorize('employer', 'recruiter', 'admin'), createPlacement);
router.patch('/:id/status', protect, updatePlacementStatus);

module.exports = router;
