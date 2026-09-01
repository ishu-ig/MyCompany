const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || process.env.DB_KEY || 'mongodb://localhost:27017/PlacementPlatform';
    const conn = await mongoose.connect(connStr);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Don't exit process in development if using remote cluster retry, but log clearly
  }
};

module.exports = connectDB;
