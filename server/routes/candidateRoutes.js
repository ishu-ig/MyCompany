const express = require('express');
const router = express.Router();
const {
  getMyProfile,
  updateMyProfile,
  searchCandidates,
  getCandidateById,
} = require('../controllers/candidateController');
const { protect } = require('../middleware/authMiddleware');

router.get('/me', protect, getMyProfile);
router.put('/me', protect, updateMyProfile);

router.get('/', searchCandidates);
router.get('/:id', getCandidateById);

module.exports = router;
