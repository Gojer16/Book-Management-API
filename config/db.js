const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ Connection Failed:', err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;