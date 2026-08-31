/**
 * expandSlotsForUser.js
 * ─────────────────────
 * For a specific user (ankanbrp2006), expands plain "YYYY-MM-DD" attendance
 * keys into per-class-slot keys based on their saved routine.
 *
 * Logic:
 *   1. Load the user's Routine (from the Routine collection) and AppState.
 *   2. For every plain "YYYY-MM-DD" key in attendance[subject]:
 *        a. Determine what day-of-week that date was.
 *        b. Find all routine classes for that subject on that day
 *           (or matching special-date classes).
 *        c. For each found class, write a slot-specific key
 *           "YYYY-MM-DD_<id-or-startTime_endTime>" with the SAME status.
 *        d. Delete the original plain key.
 *   3. Slot-keyed keys that already exist are preserved as-is.
 *   4. Save the updated AppState back to MongoDB.
 *
 * Dry-run mode (default):
 *   Shows what WOULD change without writing to DB.
 *   Pass --write to actually commit the changes.
 *
 * Usage:
 *   cd backend
 *   node scripts/expandSlotsForUser.js           # dry-run
 *   node scripts/expandSlotsForUser.js --write   # commit to DB
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Routine = require('../models/Routine');
const AppState = require('../models/AppState');

const TARGET_USERNAME = 'ankanbrp2006';
const WRITE_MODE = process.argv.includes('--write');
const SLOT_KEY_RE = /^\d{4}-\d{2}-\d{2}_.+$/;

// ─── helpers ────────────────────────────────────────────────────────────────

/** Returns 1=Mon … 7=Sun for a "YYYY-MM-DD" string. */
function dayOfWeek(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  const dow = d.getDay(); // 0=Sun
  return dow === 0 ? 7 : dow;
}

/** Build the slot suffix used in the attendance key. */
function slotSuffix(cls) {
  return cls.id || cls._id?.toString() || `${cls.startTime || '00:00'}_${cls.endTime || '00:00'}`;
}

/**
 * Given a subject and a plain dateStr, return all routine classes
 * scheduled for that subject on that date.
 */
function getClassesOnDate(routine, subject, dateStr) {
  const dow = dayOfWeek(dateStr);
  return routine.filter(cls => {
    if (cls.title !== subject) return false;
    if (cls.isSpecial) return cls.date === dateStr;
    return Number(cls.day) === dow;
  });
}

// ─── main ────────────────────────────────────────────────────────────────────

async function run() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) { console.error('❌  MONGO_URI not set'); process.exit(1); }

  await mongoose.connect(mongoUri);
  console.log('✅  Connected to MongoDB');
  console.log(WRITE_MODE ? '✏️   WRITE MODE — changes will be saved\n' : '👁️   DRY-RUN MODE — pass --write to commit\n');

  // 1. Find the target user
  const user = await User.findOne({ username: TARGET_USERNAME });
  if (!user) {
    console.error(`❌  User "${TARGET_USERNAME}" not found.`);
    await mongoose.disconnect(); process.exit(1);
  }
  console.log(`👤  User: ${user.username} (${user.name})  [_id: ${user._id}]\n`);

  // 2. Load their routine
  const routineDoc = await Routine.findOne({ userId: user._id });
  if (!routineDoc || !routineDoc.classes?.length) {
    console.error('❌  No routine found for this user. Cannot expand slots.');
    await mongoose.disconnect(); process.exit(1);
  }
  const routine = routineDoc.classes;
  console.log(`📅  Routine loaded: ${routine.length} class entries\n`);

  // Also load routine from AppState (some users store it there too)
  const appState = await AppState.findOne({ userId: user._id });
  if (!appState) {
    console.error('❌  No AppState found for this user.');
    await mongoose.disconnect(); process.exit(1);
  }

  // Merge both routine sources (Routine collection + AppState.routine)
  const appStateRoutine = Array.isArray(appState.routine) ? appState.routine : [];
  // Prefer Routine collection but fall back to AppState.routine for entries not found
  const allRoutine = [...routine, ...appStateRoutine];

  const attendance = appState.attendance || {};
  const newAttendance = JSON.parse(JSON.stringify(attendance)); // deep clone

  let totalExpanded = 0;
  let totalKept = 0;

  // 3. Process each subject
  for (const subject of Object.keys(newAttendance)) {
    const records = newAttendance[subject];
    if (!records || typeof records !== 'object') continue;

    const plainKeys = Object.keys(records).filter(k => !SLOT_KEY_RE.test(k));
    const slotKeys = Object.keys(records).filter(k => SLOT_KEY_RE.test(k));

    if (plainKeys.length === 0) {
      console.log(`  ✅  ${subject.padEnd(45)} — already fully slot-keyed (${slotKeys.length} slots)`);
      totalKept += slotKeys.length;
      continue;
    }

    console.log(`\n  📘  ${subject}`);
    console.log(`      Plain keys: ${plainKeys.length}  |  Slot keys already: ${slotKeys.length}`);

    for (const dateStr of plainKeys) {
      const status = records[dateStr];
      const classes = getClassesOnDate(allRoutine, subject, dateStr);

      if (classes.length === 0) {
        // No routine entry for that day — keep as plain key (can't expand)
        console.log(`      ${dateStr}  [${status}]  → ⚠️  no routine class found — kept as plain key`);
        totalKept++;
        continue;
      }

      // Expand: delete the plain key, add one per class slot
      delete newAttendance[subject][dateStr];

      const slotDescriptions = [];
      for (const cls of classes) {
        const suffix = slotSuffix(cls);
        const newKey = `${dateStr}_${suffix}`;

        // Don't overwrite an already-existing slot key
        if (newAttendance[subject][newKey] !== undefined) {
          slotDescriptions.push(`${newKey} [SKIPPED — already exists: ${newAttendance[subject][newKey]}]`);
        } else {
          newAttendance[subject][newKey] = status;
          slotDescriptions.push(`${newKey} → ${status}`);
          totalExpanded++;
        }
      }

      const arrow = classes.length > 1 ? `→ ${classes.length} slots` : '→ 1 slot';
      console.log(`      ${dateStr}  [${status}]  ${arrow}:`);
      slotDescriptions.forEach(s => console.log(`          ${s}`));
    }
  }

  console.log('\n' + '─'.repeat(70));
  console.log(`📊  Summary:`);
  console.log(`    Plain keys expanded into slot keys : ${totalExpanded}`);
  console.log(`    Keys kept unchanged                : ${totalKept}`);

  if (!WRITE_MODE) {
    console.log('\n👁️   DRY-RUN complete — no changes written. Re-run with --write to save.\n');
    await mongoose.disconnect(); return;
  }

  // 4. Write back
  appState.attendance = newAttendance;
  appState.markModified('attendance');
  await appState.save();
  console.log('\n✅  AppState saved to MongoDB successfully!');
  console.log('    All plain date keys expanded into per-slot keys.\n');

  await mongoose.disconnect();
  console.log('🔌  Disconnected from MongoDB.');
}

run().catch(err => {
  console.error('❌  Script failed:', err);
  process.exit(1);
});
