const express = require('express');
const router = express.Router();
const {
  enrollCourse,
  getMyEnrollments,
  getCourseEnrollments,
  updateEnrollmentProgress,
} = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('candidate'), enrollCourse);
router.get('/my-courses', protect, authorize('candidate'), getMyEnrollments);
router.get('/course/:courseId', protect, authorize('trainer', 'admin'), getCourseEnrollments);
router.patch('/:id/progress', protect, updateEnrollmentProgress);

module.exports = router;
