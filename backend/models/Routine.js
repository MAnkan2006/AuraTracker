const mongoose = require('mongoose');

const RoutineSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  classes: [{
    day: String,
    title: String,
    type: String,
    startTime: String,
    endTime: String,
    faculty: String,
    room: String,
    tag: String
  }]
});

module.exports = mongoose.model("Routine", RoutineSchema);
