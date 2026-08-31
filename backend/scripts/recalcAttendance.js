/**
 * recalcAttendance.js
 * -------------------
 * Forces a clean re-save of every user's attendance data so that:
 *   - Any slot-specific keys (YYYY-MM-DD_slotId) already in the DB
 *     are preserved exactly as-is (no collapsing).
 *   - Mongoose's Mixed-field cache is invalidated (markModified),
 *     ensuring the document is written back correctly.
 *   - A per-user summary is printed showing how many individual
 *     class-slot records exist per subject, confirming multi-class
 *     days are counted separately.
 *
 * Usage:
 *   node backend/scripts/recalcAttendance.js
 *
 * Safe to re-run — it never deletes or collapses any keys.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const AppState = require('../models/AppState');

const SLOT_KEY_RE = /^\d{4}-\d{2}-\d{2}_.+$/;

async function recalcAttendance() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('❌  MONGO_URI not set in .env');
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log('✅  Connected to MongoDB\n');

  const docs = await AppState.find({});
  console.log(`📋  Found ${docs.length} AppState document(s)\n`);

  let touchedDocs = 0;

  for (const doc of docs) {
    const attendance = doc.attendance || {};
    const subjects = Object.keys(attendance);

    if (subjects.length === 0) {
      console.log(`  User ${doc.userId} — no attendance data, skipping.`);
      continue;
    }

    console.log(`  User ${doc.userId}`);

    let totalSlotKeys = 0;
    let totalPlainKeys = 0;

    subjects.forEach(subject => {
      const records = attendance[subject] || {};
      const keys = Object.keys(records);
      const slotKeys = keys.filter(k => SLOT_KEY_RE.test(k));
      const plainKeys = keys.filter(k => !SLOT_KEY_RE.test(k));

      totalSlotKeys += slotKeys.length;
      totalPlainKeys += plainKeys.length;

      const total = keys.length;
      console.log(`    ${subject.padEnd(35)} ${String(total).padStart(3)} record(s)` +
        (slotKeys.length ? `  [${slotKeys.length} slot-keyed, ${plainKeys.length} plain-date]` : ''));
    });

    console.log(`    ─── Total: ${totalSlotKeys + totalPlainKeys} records` +
      ` (${totalSlotKeys} slot-keyed / ${totalPlainKeys} plain-date)\n`);

    // Force Mongoose to write the Mixed field back to MongoDB cleanly.
    // This is a no-op data-wise but flushes any stale cached version.
    doc.markModified('attendance');
    await doc.save();
    touchedDocs++;
  }

  console.log(`\n✅  Recalc complete — re-saved ${touchedDocs} document(s).`);
  console.log('   Slot-keyed records are preserved. Stats will now count each class slot individually.');

  await mongoose.disconnect();
  console.log('🔌  Disconnected from MongoDB.');
}

recalcAttendance().catch(err => {
  console.error('❌  Script failed:', err);
  process.exit(1);
});
