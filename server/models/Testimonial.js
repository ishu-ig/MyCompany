const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'Business Executive',
    },
    type: {
      type: String,
      enum: ['candidate', 'employer', 'college'],
      default: 'candidate',
      index: true,
    },
    companyOrCollege: {
      type: String,
      required: true,
    },
    courseOrJob: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    },
    content: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 5,
    },
    isFeatured: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);