const express = require('express');
const router = express.Router();
const { saveJob, removeSavedJob, getSavedJobs } = require('../controllers/savedJobController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('candidate'), saveJob);
router.get('/', protect, authorize('candidate'), getSavedJobs);
router.delete('/:jobId', protect, authorize('candidate'), removeSavedJob);

module.exports = router;
