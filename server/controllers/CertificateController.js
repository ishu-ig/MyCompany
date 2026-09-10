const Certificate = require('../models/Certificate');
const CourseEnrollment = require('../models/CourseEnrollment');
const TrainingCourse = require('../models/TrainingCourse');
const Notification = require('../models/Notification');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { sendCertificateIssuedEmail } = require('../utils/mailer');

const generateVerificationCode = () => {
  return 'CERT-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Date.now().toString().slice(-4);
};

const User = require('../models/User');

// @desc    Generate / Issue Certificate
// @route   POST /api/certificates
// @access  Private (Trainer/Admin)
const issueCertificate = async (req, res, next) => {
  try {
    const {
      candidateId,
      courseId,
      candidateName,
      candidateEmail,
      courseTitle,
      certificateNumber,
      verificationCode: customCode,
      grade = 'First Class',
      certificateUrl,
    } = req.body;

    let targetCandidateId = candidateId;
    let targetCourseId = courseId;

    if (!targetCandidateId && candidateEmail) {
      let user = await User.findOne({ email: candidateEmail });
      if (!user) {
        user = await User.create({
          name: candidateName || 'Certified Candidate',
          email: candidateEmail,
          password: 'Password123!',
          role: 'candidate',
        });
      }
      targetCandidateId = user._id;
    } else if (!targetCandidateId) {
      const defaultUser = await User.findOne({ role: 'candidate' });
      targetCandidateId = defaultUser ? defaultUser._id : req.user._id;
    }

    if (!targetCourseId && courseTitle) {
      const course = await TrainingCourse.findOne({ title: { $regex: courseTitle, $options: 'i' } });
      if (course) targetCourseId = course._id;
    }
    if (!targetCourseId) {
      const firstCourse = await TrainingCourse.findOne();
      if (firstCourse) targetCourseId = firstCourse._id;
    }

    const verificationCode = customCode || generateVerificationCode();
    const certNumber = certificateNumber || `TRN-${Date.now().toString().slice(-6)}`;

    const certificate = await Certificate.create({
      candidate: targetCandidateId,
      course: targetCourseId,
      certificateNumber: certNumber,
      verificationCode,
      grade,
      certificateUrl: certificateUrl || 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&q=80&w=600',
      issueDate: new Date(),
    });

    if (targetCandidateId && targetCourseId) {
      await CourseEnrollment.findOneAndUpdate(
        { candidate: targetCandidateId, course: targetCourseId },
        { certificateUrl: certificate.certificateUrl, courseStatus: 'completed', progress: 100 }
      );
    }

    const course = targetCourseId ? await TrainingCourse.findById(targetCourseId) : null;
    const targetUser = targetCandidateId ? await User.findById(targetCandidateId) : null;

    if (targetCandidateId) {
      await Notification.create({
        user: targetCandidateId,
        title: 'Certificate Issued! 🎓',
        message: `Congratulations! Your certificate for ${course?.title || 'Training Program'} is ready to download and verify.`,
        type: 'certificate',
        relatedId: certificate._id.toString(),
      });

      if (targetUser && targetUser.email) {
        sendCertificateIssuedEmail({
          candidateName: targetUser.name,
          candidateEmail: targetUser.email,
          courseTitle: course?.title || 'Training Program',
          certificateNumber: certificate.certificateNumber,
          verificationCode: certificate.verificationCode,
        }).catch((err) => console.error('Certificate email error:', err));
      }
    }

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