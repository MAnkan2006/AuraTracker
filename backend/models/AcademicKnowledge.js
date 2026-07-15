const mongoose = require('mongoose');

const AcademicKnowledgeSchema = new mongoose.Schema({
  college: { type: String, index: true },
  department: { type: String, index: true },
  semester: { type: Number, index: true },
  subjects: [{
    name: String,
    code: String,
    aliases: [String],
    credits: Number,
    type: { type: String, enum: ['theory', 'lab', 'tutorial'] }
  }],
  syllabus: String,
  source: String,
  lastUpdated: { type: Date, default: Date.now },
  confidence: Number
});

module.exports = mongoose.model("AcademicKnowledge", AcademicKnowledgeSchema);
