require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function checkEmail() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");
    
    const user = await User.findOne({ username: 'AM12' });
    if (user) {
      console.log('User found:');
      console.log(user);
    } else {
      console.log('No user found with that username.');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkEmail();
