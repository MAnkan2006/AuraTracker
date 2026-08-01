/**
 * Standalone migration script to normalize legacy attendance keys ("YYYY-MM-DD_slotX")
 * to plain "YYYY-MM-DD" in the AppState collection using status priority:
 * Absent > Late > Present > Excused > Cancelled.
 *
 * Usage (do NOT run in automated builds or without approval):
 *   node backend/scripts/migrateAttendanceKeys.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const AppState = require('../models/AppState');

const STATUS_PRIORITY = {
  'Absent': 5, 'a': 5,
  'Late': 4, 'l': 4,
  'Present': 3, 'p': 3,
  'Excused': 2, 'e': 2,
  'Cancelled': 1, 'c': 1
};

async function migrateAttendanceKeys() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGO_URI is not defined in environment variables.');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for attendance key migration.');

    const appStates = await AppState.find({ attendance: { $ne: null } });
    console.log(`Found ${appStates.length} AppState document(s).`);

    let updatedDocs = 0;

    for (const stateDoc of appStates) {
      let modified = false;
      const attendance = stateDoc.attendance || {};
      const normalizedAttendance = {};

      Object.entries(attendance).forEach(([subject, logs]) => {
        if (!logs || typeof logs !== 'object') return;
        normalizedAttendance[subject] = {};

        Object.entries(logs).forEach(([key, status]) => {
          const match = key.match(/^(\d{4}-\d{2}-\d{2})_.+$/);
          const dateKey = match ? match[1] : key;

          if (match) {
            modified = true;
          }

          const existingStatus = normalizedAttendance[subject][dateKey];
          if (!existingStatus) {
            normalizedAttendance[subject][dateKey] = status;
          } else {
            const existingPriority = STATUS_PRIORITY[existingStatus] || 0;
            const currentPriority = STATUS_PRIORITY[status] || 0;
            if (currentPriority > existingPriority) {
              normalizedAttendance[subject][dateKey] = status;
            }
          }
        });
      });

      if (modified) {
        stateDoc.attendance = normalizedAttendance;
        stateDoc.markModified('attendance');
        await stateDoc.save();
        console.log(`Normalized attendance keys for AppState document ID ${stateDoc._id} (User: ${stateDoc.userId})`);
        updatedDocs++;
      }
    }

    console.log(`Migration complete. Successfully normalized ${updatedDocs} AppState document(s).`);
  } catch (error) {
    console.error('Error during attendance key migration:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

if (require.main === module) {
  migrateAttendanceKeys();
}

module.exports = migrateAttendanceKeys;
