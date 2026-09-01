const mongoose = require('mongoose');

const contactEnquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      default: '',
    },
    organization: {
      type: String,
      default: '',
      trim: true,
    },
    userType: {
      type: String,
      default: 'company',
    },
    service: {
      type: String,
      default: 'General Consultation',
    },
    subject: {
      type: String,
      default: 'Partnership Inquiry',
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['new', 'in_review', 'resolved'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ContactEnquiry', contactEnquirySchema);
