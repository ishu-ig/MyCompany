const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const candidateRoutes = require('./candidateRoutes');
const employerRoutes = require('./employerRoutes');
const trainerRoutes = require('./trainerRoutes');
const collegeRoutes = require('./collegeRoutes');
const recruiterRoutes = require('./recruiterRoutes');
const jobRoutes = require('./jobRoutes');
const applicationRoutes = require('./applicationRoutes');
const savedJobRoutes = require('./savedJobRoutes');
const courseRoutes = require('./courseRoutes');
const enrollmentRoutes = require('./enrollmentRoutes');
const attendanceRoutes = require('./attendanceRoutes');
const assessmentRoutes = require('./assessmentRoutes');
const certificateRoutes = require('./certificateRoutes');
const interviewRoutes = require('./interviewRoutes');
const placementRoutes = require('./placementRoutes');
const recruitmentRequestRoutes = require('./recruitmentRequestRoutes');
const notificationRoutes = require('./notificationRoutes');
const messageRoutes = require('./messageRoutes');
const blogRoutes = require('./blogRoutes');
const testimonialRoutes = require('./testimonialRoutes');
const contactRoutes = require('./contactRoutes');
const adminRoutes = require('./adminRoutes');

// Mount domain routes
router.use('/auth', authRoutes);
router.use('/candidates', candidateRoutes);
router.use('/employers', employerRoutes);
router.use('/trainers', trainerRoutes);
router.use('/colleges', collegeRoutes);
router.use('/recruiters', recruiterRoutes);
router.use('/jobs', jobRoutes);
router.use('/applications', applicationRoutes);
router.use('/saved-jobs', savedJobRoutes);
router.use('/courses', courseRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/certificates', certificateRoutes);
router.use('/interviews', interviewRoutes);
router.use('/placements', placementRoutes);
router.use('/recruitment-requests', recruitmentRequestRoutes);
router.use('/notifications', notificationRoutes);
router.use('/messages', messageRoutes);
router.use('/blogs', blogRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/contact', contactRoutes);
router.use('/admin', adminRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Placement & Non-IT Training Platform API is operational 🚀',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;