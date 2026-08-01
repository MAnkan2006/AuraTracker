/**
 * Standalone migration script to update legacy avatar strings ("avatar-1".."avatar-5")
 * in the MongoDB User collection to full DiceBear avataaars v7.x URLs.
 *
 * Usage (do NOT run in automated builds or without approval):
 *   node backend/scripts/migrateAvatars.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const AVATAR_PRESETS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Oreo",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Loki"
];

async function migrateAvatars() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGO_URI is not defined in environment variables.');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for avatar migration.');

    const legacyUsers = await User.find({ avatar: { $regex: /^avatar-[1-5]$/ } });
    console.log(`Found ${legacyUsers.length} user(s) with legacy avatar format.`);

    let updatedCount = 0;

    for (const user of legacyUsers) {
      const match = user.avatar.match(/^avatar-([1-5])$/);
      if (match) {
        const index = parseInt(match[1], 10) - 1;
        if (index >= 0 && index < AVATAR_PRESETS.length) {
          const oldAvatar = user.avatar;
          user.avatar = AVATAR_PRESETS[index];
          await user.save();
          console.log(`Updated user '${user.username}': ${oldAvatar} -> ${user.avatar}`);
          updatedCount++;
        }
      }
    }

    console.log(`Migration complete. Successfully updated ${updatedCount} user(s).`);
  } catch (error) {
    console.error('Error during avatar migration:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

if (require.main === module) {
  migrateAvatars();
}

module.exports = migrateAvatars;
