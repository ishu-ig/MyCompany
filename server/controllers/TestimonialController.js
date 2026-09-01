const Testimonial = require('../models/Testimonial');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
const getTestimonials = async (req, res, next) => {
  try {
    const { type } = req.query;
    const query = {};
    if (type) query.type = type;

    const testimonials = await Testimonial.find(query).sort({ createdAt: -1 });
    return sendSuccess(res, 'Testimonials retrieved', testimonials);
  } catch (error) {
    next(error);
  }
};

// @desc    Create testimonial
// @route   POST /api/testimonials
// @access  Private (Admin / Authenticated)
const createTestimonial = async (req, res, next) => {
  try {
    const { name, role, type, companyOrCollege, courseOrJob, avatar, content, rating } = req.body;

    if (!name || !content || !companyOrCollege) {
      return sendError(res, 'Name, content, and company/college name are required', 400);
    }

    const testimonial = await Testimonial.create({
      name,
      role: role || 'Professional',
      type: type || 'candidate',
      companyOrCollege,
      courseOrJob: courseOrJob || '',
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      content,
      rating: rating || 5,
    });

    return sendSuccess(res, 'Testimonial created', testimonial, 201);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTestimonials,
  createTestimonial,
};