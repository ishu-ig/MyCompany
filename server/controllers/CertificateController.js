const Certificate = require('../models/Certificate');
const CourseEnrollment = require('../models/CourseEnrollment');
const TrainingCourse = require('../models/TrainingCourse');
const Notification = require('../models/Notification');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const generateVerificationCode = () => {
  return 'CERT-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Date.now().toString().slice(-4);
};

// @desc    Generate / Issue Certificate
// @route   POST /api/certificates
// @access  Private (Trainer/Admin)
const issueCertificate = async (req, res, next) => {
  try {
    const { candidateId, courseId, grade = 'First Class', certificateUrl } = req.body;

    if (!candidateId || !courseId) {
      return sendError(res, 'Candidate ID and Course ID are required', 400);
    }

    const verificationCode = generateVerificationCode();
    const certNumber = `TRN-${Date.now().toString().slice(-6)}`;

    const certificate = await Certificate.create({
      candidate: candidateId,
      course: courseId,
      certificateNumber: certNumber,
      verificationCode,
      grade,
      certificateUrl: certificateUrl || 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&q=80&w=600',
      issueDate: new Date(),
    });

    // Update enrollment
    await CourseEnrollment.findOneAndUpdate(
      { candidate: candidateId, course: courseId },
      { certificateUrl: certificate.certificateUrl, courseStatus: 'completed', progress: 100 }
    );

    const course = await TrainingCourse.findById(courseId);

    // Send notification
    await Notification.create({
      user: candidateId,
      title: 'Certificate Issued! 🎓',
      message: `Congratulations! Your certificate for ${course?.title || 'Training Program'} is ready to download and verify.`,
      type: 'certificate',
      relatedId: certificate._id.toString(),
    });

    return sendSuccess(res, 'Certificate issued successfully', certificate, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Get candidate certificates
// @route   GET /api/certificates/my-certificates
// @access  Private (Candidate)
const getMyCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find({ candidate: req.user._id })
      .populate('course', 'title category duration')
      .sort({ issueDate: -1 });

    return sendSuccess(res, 'Certificates retrieved', certificates);
  } catch (error) {
    next(error);
  }
};

// @desc    Public certificate verification
// @route   GET /api/certificates/verify/:verificationCode
// @access  Public
const verifyCertificate = async (req, res, next) => {
  try {
    const { verificationCode } = req.params;
    const cleanCode = verificationCode ? verificationCode.trim() : '';

    const certificate = await Certificate.findOne({
      $or: [
        { verificationCode: { $regex: new RegExp(`^${cleanCode}$`, 'i') } },
        { certificateNumber: { $regex: new RegExp(`^${cleanCode}$`, 'i') } },
      ],
    })
      .populate('candidate', 'name email avatar phone')
      .populate('course', 'title category duration syllabus');

    if (!certificate) {
      return sendError(res, 'Invalid or unverified certificate code. No matching credential found.', 404);
    }

    return sendSuccess(res, 'Certificate verified successfully and is authentic.', certificate);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all certificates (Admin)
// @route   GET /api/certificates
// @access  Private (Admin)
const getAllCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find()
      .populate('candidate', 'name email phone avatar')
      .populate('course', 'title category')
      .sort({ issueDate: -1 });

    return sendSuccess(res, 'All certificates retrieved', certificates);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  issueCertificate,
  getMyCertificates,
  verifyCertificate,
  getAllCertificates,
};