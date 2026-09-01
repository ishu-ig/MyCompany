const express = require('express');
const router = express.Router();
const {
  issueCertificate,
  getMyCertificates,
  verifyCertificate,
  getAllCertificates,
} = require('../controllers/CertificateController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public verification
router.get('/verify/:verificationCode', verifyCertificate);

// Protected routes
router.use(protect);
router.get('/my-certificates', authorize('candidate'), getMyCertificates);
router.post('/', authorize('trainer', 'admin'), issueCertificate);
router.get('/', authorize('admin', 'trainer'), getAllCertificates);

module.exports = router;
