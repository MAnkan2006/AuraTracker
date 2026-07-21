const mongoose = require('mongoose');

const AppStateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  selectedTheme: { type: String, default: 'classic-obsidian' },
  selectedFont: { type: String, default: 'font-modern' },
  routineView: { type: String, default: 'daily' },
  activeRoutineDay: { type: Number, default: 1 },
  todos: { type: mongoose.Schema.Types.Mixed, default: [] },
  attendance: { type: mongoose.Schema.Types.Mixed, default: {} },
  routine: { type: mongoose.Schema.Types.Mixed, default: [] }
});

module.exports = mongoose.model("AppState", AppStateSchema);
