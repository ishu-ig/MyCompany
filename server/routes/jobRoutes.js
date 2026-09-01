const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  getJobBySlug,
  createJob,
  updateJob,
  deleteJob,
  updateJobStatus,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getJobs);
router.get('/slug/:slug', getJobBySlug);
router.get('/:id', getJobById);

router.post('/', protect, authorize('employer', 'recruiter', 'admin'), createJob);
router.put('/:id', protect, authorize('employer', 'recruiter', 'admin'), updateJob);
router.delete('/:id', protect, authorize('employer', 'admin'), deleteJob);
router.patch('/:id/status', protect, authorize('employer', 'recruiter', 'admin'), updateJobStatus);

module.exports = router;
