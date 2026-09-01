const express = require('express');
const router = express.Router();
const {
  getCourseAssessments,
  getAssessmentById,
  createAssessment,
  submitAssessment,
  getMyResults,
} = require('../controllers/assessmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/course/:courseId', getCourseAssessments);
router.get('/results/my-results', protect, getMyResults);
router.get('/:id', protect, getAssessmentById);

router.post('/', protect, authorize('trainer', 'admin'), createAssessment);
router.post('/:id/submit', protect, authorize('candidate'), submitAssessment);

module.exports = router;
