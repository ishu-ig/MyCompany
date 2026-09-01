const express = require('express');
const router = express.Router();
const {
  submitContact,
  getContactEnquiries,
  updateContactStatus,
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', submitContact);
router.get('/', protect, authorize('admin'), getContactEnquiries);
router.patch('/:id/status', protect, authorize('admin'), updateContactStatus);
router.put('/:id/status', protect, authorize('admin'), updateContactStatus);

module.exports = router;
