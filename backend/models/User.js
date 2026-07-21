const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  name: String,
  email: String,
  avatar: String,
  bio: String,
  targetGoal: Number,
  password: String,
  googleId: String,
  githubId: String,
  academicProfile: {
    college: String,
    department: String,
    semester: Number,
    academicSession: String,
    university: String,
    program: String,
    section: String,
    termStartDate: Date
  },
  onboardingComplete: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("User", UserSchema);
