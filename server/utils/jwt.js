const jwt = require('jsonwebtoken');

const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'supersecretjwtkey_placement_training_platform_2026',
    { expiresIn: process.env.JWT_ACCESS_EXPIRE || '7d' }
  );
};

const generateRefreshToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_REFRESH_SECRET || 'supersecretjwtrefreshkey_placement_training_platform_2026',
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' }
  );
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
