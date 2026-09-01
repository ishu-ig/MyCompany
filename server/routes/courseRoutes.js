const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseById,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getCourses);
router.get('/slug/:slug', getCourseBySlug);
router.get('/:id', getCourseById);

router.post('/', protect, authorize('trainer', 'admin'), createCourse);
router.put('/:id', protect, authorize('trainer', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('admin'), deleteCourse);

module.exports = router;
