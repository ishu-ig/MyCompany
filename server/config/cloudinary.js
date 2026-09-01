const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dmlqcwkjn',
  api_key: process.env.CLOUDINARY_API_KEY || '915186893372124',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'UqGMqhsoimF3zZANmW7gULrJjLo',
});

module.exports = cloudinary;
