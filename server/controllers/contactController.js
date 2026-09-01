const ContactEnquiry = require('../models/ContactEnquiry');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Submit a contact enquiry
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, organization, roleType, userType, service, subject, message } = req.body;

    if (!name || !email || !message) {
      return sendError(res, 'Name, email, and message are required', 400);
    }

    const determinedUserType = roleType || userType || 'company';
    const determinedSubject = subject || (organization ? `Partnership Inquiry - ${organization}` : `Inquiry from ${name}`);

    const enquiry = await ContactEnquiry.create({
      name,
      email,
      phone: phone || '',
      organization: organization || '',
      userType: determinedUserType,
      service: service || 'Train-and-Hire Consultation',
      subject: determinedSubject,
      message,
    });

    return sendSuccess(
      res,
      'Thank you! Your inquiry has been received. Our team will contact you shortly.',
      enquiry,
      201
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get all enquiries (Admin)
// @route   GET /api/contact
// @access  Private (Admin)
const getContactEnquiries = async (req, res, next) => {
  try {
    const enquiries = await ContactEnquiry.find().sort({ createdAt: -1 });
    return sendSuccess(res, 'Contact enquiries retrieved', enquiries);
  } catch (error) {
    next(error);
  }
};

// @desc    Update enquiry status
// @route   PUT/PATCH /api/contact/:id/status
// @access  Private (Admin)
const updateContactStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const enquiry = await ContactEnquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!enquiry) {
      return sendError(res, 'Enquiry not found', 404);
    }
    return sendSuccess(res, 'Status updated', enquiry);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContact,
  getContactEnquiries,
  updateContactStatus,
};
