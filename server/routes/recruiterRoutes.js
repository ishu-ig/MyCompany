const express = require('express');
const router = express.Router();
const { getRecruiterStats } = require('../controllers/recruiterController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/dashboard/stats', protect, authorize('recruiter', 'admin'), getRecruiterStats);

module.exports = router;
