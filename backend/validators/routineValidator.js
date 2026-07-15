const { fuzzyMatch } = require('../utils/fuzzyMatcher');

const VALID_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DAY_MAP = {};
VALID_DAYS.forEach(d => {
  DAY_MAP[d.toLowerCase()] = d;
});
// Common abbreviations
const DAY_ABBREVIATIONS = {
  'mon': 'Monday',
  'tue': 'Tuesday',
  'tues': 'Tuesday',
  'wed': 'Wednesday',
  'thu': 'Thursday',
  'thur': 'Thursday',
  'thurs': 'Thursday',
  'fri': 'Friday',
  'sat': 'Saturday',
  'sun': 'Sunday'
};
Object.assign(DAY_MAP, DAY_ABBREVIATIONS);

const VALID_TYPES = ['theory', 'lab', 'tutorial'];

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

/**
 * Validate and normalize Gemini AI output for a class routine.
 *
 * @param {Object} data - Raw parsed JSON from Gemini
 * @param {Array}  knownSubjects - Subjects from AcademicKnowledge cache
 * @returns {Object} - { valid: boolean, errors: string[], warnings: string[], classes: Object[] }
 */
const validateRoutine = (data, knownSubjects = []) => {
  const errors = [];
  const warnings = [];
  const normalizedClasses = [];

  // Structural validation
  if (!data || typeof data !== 'object') {
    errors.push('Response is not a valid object');
    return { valid: false, errors, warnings, classes: [] };
  }

  if (!Array.isArray(data.classes)) {
    errors.push('Response is missing "classes" array');
    return { valid: false, errors, warnings, classes: [] };
  }

  if (data.classes.length === 0) {
    errors.push('The "classes" array is empty. No schedule entries were extracted.');
    return { valid: false, errors, warnings, classes: [] };
  }

  // Validate each class entry
  for (let i = 0; i < data.classes.length; i++) {
    const cls = data.classes[i];
    const label = `Class #${i + 1}`;
    const entryErrors = [];

    if (!cls || typeof cls !== 'object') {
      errors.push(`${label}: Not a valid object`);
      continue;
    }

    // Day validation & normalization
    if (!cls.day) {
      entryErrors.push(`${label}: Missing "day" field`);
    }

    let normalizedDay = null;
    if (cls.day) {
      const dayLower = String(cls.day).trim().toLowerCase();
      normalizedDay = DAY_MAP[dayLower] || null;

      if (!normalizedDay) {
        entryErrors.push(`${label}: Invalid day "${cls.day}". Must be Monday-Sunday.`);
      }
    }

    // Title validation
    if (!cls.title || String(cls.title).trim().length === 0) {
      entryErrors.push(`${label}: Missing "title" field`);
    }

    // Time validation
    const startTime = cls.startTime ? String(cls.startTime).trim() : null;
    const endTime = cls.endTime ? String(cls.endTime).trim() : null;

    if (!startTime) {
      entryErrors.push(`${label}: Missing "startTime" field`);
    } else if (!TIME_REGEX.test(startTime)) {
      entryErrors.push(`${label}: Invalid startTime "${startTime}". Must be HH:MM in 24h format.`);
    }

    if (!endTime) {
      entryErrors.push(`${label}: Missing "endTime" field`);
    } else if (!TIME_REGEX.test(endTime)) {
      entryErrors.push(`${label}: Invalid endTime "${endTime}". Must be HH:MM in 24h format.`);
    }

    // Check endTime > startTime
    if (startTime && endTime && TIME_REGEX.test(startTime) && TIME_REGEX.test(endTime)) {
      if (endTime <= startTime) {
        warnings.push(`${label}: endTime "${endTime}" is not after startTime "${startTime}"`);
      }
    }

    // If critical fields are missing, skip this entry
    if (entryErrors.length > 0) {
      errors.push(...entryErrors);
      continue;
    }

    // Normalize type
    let normalizedType = 'theory';
    if (cls.type) {
      const typeLower = String(cls.type).trim().toLowerCase();
      if (VALID_TYPES.includes(typeLower)) {
        normalizedType = typeLower;
      } else {
        // Try to infer
        if (typeLower.includes('lab') || typeLower.includes('practical')) {
          normalizedType = 'lab';
        } else if (typeLower.includes('tutorial') || typeLower.includes('tut')) {
          normalizedType = 'tutorial';
        } else {
          warnings.push(`${label}: Unknown type "${cls.type}", defaulting to "theory"`);
        }
      }
    } else {
      warnings.push(`${label}: Missing "type" field, defaulting to "theory"`);
    }

    // Fuzzy match title against known subjects
    let normalizedTitle = String(cls.title).trim();
    if (knownSubjects.length > 0) {
      const matched = fuzzyMatch(normalizedTitle, knownSubjects);
      if (matched && matched.name) {
        if (matched.name.toLowerCase() !== normalizedTitle.toLowerCase()) {
          warnings.push(`${label}: Title "${normalizedTitle}" matched to known subject "${matched.name}"`);
        }
        normalizedTitle = matched.name;
      }
    }

    normalizedClasses.push({
      day: normalizedDay,
      title: normalizedTitle,
      type: normalizedType,
      startTime,
      endTime,
      faculty: cls.faculty ? String(cls.faculty).trim() : '',
      room: cls.room ? String(cls.room).trim() : ''
    });
  }

  // Detect duplicates (same day + startTime + endTime)
  const seen = new Set();
  const deduped = [];

  for (const cls of normalizedClasses) {
    const key = `${cls.day}|${cls.startTime}|${cls.endTime}`;
    if (seen.has(key)) {
      warnings.push(`Duplicate entry detected: ${cls.title} on ${cls.day} at ${cls.startTime}-${cls.endTime} (removed)`);
    } else {
      seen.add(key);
      deduped.push(cls);
    }
  }

  const hasErrors = errors.length > 0;
  // Allow partial results if we have at least some valid classes
  const valid = deduped.length > 0;

  return {
    valid,
    errors,
    warnings,
    classes: deduped
  };
};

module.exports = { validateRoutine };
