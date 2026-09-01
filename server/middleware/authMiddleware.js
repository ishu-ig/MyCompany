const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendError } = require('../utils/responseHandler');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return sendError(res, 'Not authorized, please login to proceed', 401);
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'supersecretjwtkey_placement_training_platform_2026'
    );

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return sendError(res, 'The user belonging to this token no longer exists', 401);
    }

    if (!user.isActive) {
      return sendError(res, 'Your account has been deactivated. Please contact support.', 403);
    }

    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 'Not authorized, token failed or expired', 401, error.message);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Authentication required', 401);
    }
    if (!roles.includes(req.user.role) && req.user.role !== 'admin') {
      return sendError(
        res,
        `Role '${req.user.role}' is not authorized to access this resource`,
        403
      );
    }
    next();
  };
};

module.exports = {
  protect,
  authorize,
};
