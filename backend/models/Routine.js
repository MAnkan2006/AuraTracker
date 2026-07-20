const mongoose = require('mongoose');

const RoutineSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  classes: [{
    day: { type: String },
    title: { type: String },
    type: { type: String }, // <-- This was the bug! Mongoose treated this as the schema type for the whole array element.
    startTime: { type: String },
    endTime: { type: String },
    faculty: { type: String },
    room: { type: String },
    tag: { type: String },
    isSpecial: { type: Boolean, default: false },
    date: { type: String }
  }]
});

module.exports = mongoose.model("Routine", RoutineSchema);
