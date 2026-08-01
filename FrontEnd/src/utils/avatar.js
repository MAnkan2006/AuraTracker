export const DEFAULT_AVATAR_PRESETS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Oreo",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Loki"
];

/**
 * Returns a valid image URL for the user avatar.
 * Handles legacy "avatar-1".."avatar-5" strings and unexpected non-URL strings.
 */
export const getAvatarUrl = (avatar) => {
  if (typeof avatar === 'string' && (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('/'))) {
    return avatar;
  }
  
  if (typeof avatar === 'string' && /^avatar-[1-5]$/.test(avatar)) {
    const idx = parseInt(avatar.split('-')[1], 10) - 1;
    if (idx >= 0 && idx < DEFAULT_AVATAR_PRESETS.length) {
      return DEFAULT_AVATAR_PRESETS[idx];
    }
  }

  return DEFAULT_AVATAR_PRESETS[0];
};
