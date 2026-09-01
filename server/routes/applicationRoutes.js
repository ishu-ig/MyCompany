const express = require('express');
const router = express.Router();
const {
  applyBootcampCandidate,
  applyJob,
  getMyApplications,
  getJobApplications,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public Bootcamp application from client
router.post('/bootcamp', applyBootcampCandidate);

// Job Applications
router.post('/', protect, authorize('candidate'), applyJob);
router.get('/my-applications', protect, authorize('candidate'), getMyApplications);
router.get('/job/:jobId', protect, authorize('employer', 'recruiter', 'admin'), getJobApplications);
router.get('/', protect, authorize('employer', 'recruiter', 'admin'), getAllApplications);
router.get('/:id', protect, getApplicationById);
router.patch('/:id/status', protect, authorize('employer', 'recruiter', 'admin'), updateApplicationStatus);

module.exports = router;
