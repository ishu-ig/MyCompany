const User = require('../models/User');
const CandidateProfile = require('../models/CandidateProfile');
const EmployerProfile = require('../models/EmployerProfile');
const CollegeProfile = require('../models/CollegeProfile');
const TrainerProfile = require('../models/TrainerProfile');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role = 'candidate', companyName, collegeName, specialization } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 'Please provide name, email, and password', 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 'A user with this email already exists', 400);
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: ['candidate', 'employer', 'recruiter', 'college', 'trainer', 'admin'].includes(role)
        ? role
        : 'candidate',
    });

    // Create corresponding profile based on role
    if (user.role === 'candidate') {
      await CandidateProfile.create({
        user: user._id,
        headline: 'Job Seeker / Candidate',
      });
    } else if (user.role === 'employer') {
      await EmployerProfile.create({
        user: user._id,
        companyName: companyName || `${name}'s Company`,
      });
    } else if (user.role === 'college') {
      await CollegeProfile.create({
        user: user._id,
        collegeName: collegeName || `${name} Institute / College`,
      });
    } else if (user.role === 'trainer') {
      await TrainerProfile.create({
        user: user._id,
        specialization: specialization ? [specialization] : ['Non-IT Training', 'Business Skills'],
      });
    }

    const token = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    };

    return sendSuccess(res, 'Registration successful', {
      user: userResponse,
      token,
      refreshToken,
    }, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Please provide email and password', 400);
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return sendError(res, 'Invalid credentials', 401);
    }

    if (!user.isActive) {
      return sendError(res, 'Account is disabled. Please contact administrator.', 403);
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return sendError(res, 'Invalid credentials', 401);
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    };

    return sendSuccess(res, 'Login successful', {
      user: userResponse,
      token,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user & role profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let profile = null;

    if (user.role === 'candidate') {
      profile = await CandidateProfile.findOne({ user: user._id });
    } else if (user.role === 'employer') {
      profile = await EmployerProfile.findOne({ user: user._id });
    } else if (user.role === 'college') {
      profile = await CollegeProfile.findOne({ user: user._id });
    } else if (user.role === 'trainer') {
      profile = await TrainerProfile.findOne({ user: user._id });
    }

    return sendSuccess(res, 'User data retrieved', {
      user,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   POST /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return sendError(res, 'Please provide current and new password', 400);
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return sendError(res, 'Current password does not match', 400);
    }

    user.password = newPassword;
    await user.save();

    return sendSuccess(res, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return sendSuccess(res, 'If an account with this email exists, a password reset link has been dispatched.');
    }
    // Simulation / token generation for reset
    return sendSuccess(res, 'Password reset instructions have been sent to your email.');
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return sendError(res, 'Email and new password are required', 400);
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return sendError(res, 'User not found', 404);
    }
    user.password = newPassword;
    await user.save();

    return sendSuccess(res, 'Password has been reset successfully. Please log in.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  changePassword,
  forgotPassword,
  resetPassword,
};
