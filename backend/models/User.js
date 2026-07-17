const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: String,
  avatar: String,
  bio: String,
  targetGoal: Number,
  password: String,
  academicProfile: {
    college: String,
    department: String,
    semester: Number,
    academicSession: String,
    university: String,
    program: String,
    section: String
  },
  onboardingComplete: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("User", UserSchema);
