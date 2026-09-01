const express = require('express');
const router = express.Router();
const { markAttendance, getCourseAttendance } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('trainer', 'admin'), markAttendance);
router.get('/course/:courseId', protect, getCourseAttendance);

module.exports = router;
