/**
 * Build a deterministic prompt for Gemini to extract class schedule from PDF text.
 *
 * @param {Object} params
 * @param {string} params.college - College name
 * @param {string} params.department - Department name
 * @param {string} params.program - Program name (e.g., "B.Tech", "BCA")
 * @param {number} params.semester - Semester number
 * @param {string} params.section - Section or Group (e.g., A, B)
 * @param {Array}  params.subjects - Known subjects from AcademicKnowledge cache
 * @param {string} params.pdfText - Extracted text from the routine PDF
 * @returns {string} - Complete prompt string
 */
const buildPrompt = ({ college, department, program, semester, section, subjects, pdfText }) => {
  const subjectList = formatSubjectList(subjects);

  const prompt = `You are an expert academic schedule parser. Your task is to extract a weekly class routine/timetable from the provided PDF text and return it as structured JSON.

ACADEMIC CONTEXT:
- College: ${college || 'Unknown'}
- Department: ${department || 'Unknown'}
- Program: ${program || 'Unknown'}
- Semester: ${semester || 'Unknown'}
- Section/Group: ${section || 'Unknown'}

KNOWN SUBJECTS FOR THIS SEMESTER:
${subjectList || 'No subject data available. Infer subjects from the PDF content.'}

STEP-BY-STEP PARSING STRATEGY:

Step 1 — Identify the timetable structure:
  - It may be a GRID TABLE where rows = days and columns = time slots (or vice-versa).
  - It may be a LIST FORMAT where each entry has day + time + subject on one or more lines.
  - Look for header rows/columns containing "Monday", "Tuesday", "MON", "TUE", day numbers, or abbreviations.
  - Look for time markers in various formats (see Step 3).

Step 2 — For GRID tables, cross-reference the row (day) and column (time slot) to get each cell's class info.
  - If rows are days and columns are time slots, read each non-empty cell.
  - If rows are time slots and columns are days, transpose accordingly.
  - Cells may contain: subject name, faculty name, room number, or a combination separated by newlines or slashes.

Step 3 — Normalize EVERY time value using these rules:
  a) "9:00 AM"  or "9 AM"   → "09:00"       (12-hour AM)
  b) "9:00 PM"  or "9 PM"   → "21:00"       (12-hour PM → add 12 hours)
  c) "12:00 PM"             → "12:00"       (noon exception)
  d) "12:00 AM"             → "00:00"       (midnight exception)
  e) "9.00"     or "9.30"   → "09:00" / "09:30"  (period used as time separator)
  f) "0900"     or "1430"   → "09:00" / "14:30"  (4-digit military/compact format)
  g) "9-10"                 → startTime="09:00", endTime="10:00"
  h) "9:00-10:00"           → startTime="09:00", endTime="10:00"
  i) "9:00-10:30"           → startTime="09:00", endTime="10:30"
  j) "9.00-10.00"           → startTime="09:00", endTime="10:00"
  k) If only a start time is visible, infer endTime by adding 1 hour (or match neighbouring slot times for accuracy).
  l) ALWAYS output times as "HH:MM" in 24-hour format with leading zeros: "09:00" not "9:00".

Step 4 — Normalize day names to full English names:
  - "Mon" / "MO" / "M"      → "Monday"
  - "Tue" / "TU" / "T"      → "Tuesday"
  - "Wed" / "WE" / "W"      → "Wednesday"
  - "Thu" / "TH"            → "Thursday"
  - "Fri" / "FR" / "F"      → "Friday"
  - "Sat" / "SA" / "S"      → "Saturday"
  - "Sun" / "SU"            → "Sunday"

ADDITIONAL RULES:
1. Use the known subjects list to match and normalize subject names. Map abbreviations/codes (e.g., "DBMS", "SE-L") to the full subject name from the list.
2. If a field (faculty, room) is not available in the PDF, set it to an empty string "".
3. TYPE INFERENCE — the "type" field must be one of: "theory", "lab", or "tutorial":
   - Keywords: "Lab" / "Practical" / "Prac" / "-L" suffix / "P" → "lab"
   - Keywords: "Tutorial" / "Tut" / "-T" suffix / "T" → "tutorial"
   - Default (Lecture / "Lec" / "L" / no keyword) → "theory"
4. Do NOT include: break periods, lunch hours, library hours, free periods, or empty cells.
5. SECTION FILTER — CRITICAL: If the timetable contains multiple sections (e.g., Section A, Section B, Gr-1, Gr-2, Division 1/2), extract ONLY the data for Section: "${section || 'Unknown'}". Ignore all rows/columns/cells that belong to other sections. If the PDF has no section information, treat the entire timetable as applicable.
6. Do NOT invent or hallucinate classes. Only extract what is explicitly written in the PDF text.
7. If the same class appears at the same day + time due to a duplicate entry in the PDF, include it only once.

OUTPUT FORMAT:
You MUST output ONLY valid JSON with no markdown formatting, no code fences, no explanations, and no text before or after the JSON. Use exactly this structure:

{"classes":[{"day":"Monday","title":"Database Management Systems","type":"theory","startTime":"09:00","endTime":"10:00","faculty":"Dr. Smith","room":"Room 301"}]}

Each object in the "classes" array must have exactly these keys: "day", "title", "type", "startTime", "endTime", "faculty", "room".

EXTRACTED PDF TEXT:
---
${pdfText}
---

Remember: Output ONLY the JSON object. No other text whatsoever.`;

  return prompt;
};

/**
 * Format the known subjects into a readable list for the prompt.
 * @param {Array} subjects - Array of subject objects from AcademicKnowledge
 * @returns {string} - Formatted subject list
 */
const formatSubjectList = (subjects) => {
  if (!subjects || subjects.length === 0) return '';

  return subjects.map((subj, idx) => {
    let entry = `${idx + 1}. ${subj.name}`;

    if (subj.code) {
      entry += ` (${subj.code})`;
    }

    if (subj.aliases && subj.aliases.length > 0) {
      entry += ` — also known as: ${subj.aliases.join(', ')}`;
    }

    if (subj.type) {
      entry += ` [${subj.type}]`;
    }

    return entry;
  }).join('\n');
};

module.exports = { buildPrompt };
