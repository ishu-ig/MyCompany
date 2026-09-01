const express = require('express');
const router = express.Router();
const {
  getTestimonials,
  createTestimonial,
} = require('../controllers/TestimonialController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getTestimonials);

// Admin route
router.use(protect);
router.post('/', authorize('admin'), createTestimonial);

module.exports = router;
