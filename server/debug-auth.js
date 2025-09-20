const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function debugAuth() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medical-contracts');
    console.log('Connected to MongoDB');

    // Find a user
    const user = await User.findOne({ email: 'test@example.com' });
    if (!user) {
      console.log('No user found with email test@example.com');
      return;
    }

    console.log('User found:', {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      hasPassword: !!user.password,
      passwordLength: user.password ? user.password.length : 0,
      passwordStart: user.password ? user.password.substring(0, 10) + '...' : 'No password'
    });

    // Test password comparison
    try {
      const isMatch = await user.comparePassword('testpassword');
      console.log('Password match result:', isMatch);
    } catch (error) {
      console.error('Password comparison error:', error.message);
    }

  } catch (error) {
    console.error('Debug error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

debugAuth();
