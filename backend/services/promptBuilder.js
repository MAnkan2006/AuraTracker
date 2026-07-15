/**
 * Build a deterministic prompt for Gemini to extract class schedule from PDF text.
 *
 * @param {Object} params
 * @param {string} params.college - College name
 * @param {string} params.department - Department name
 * @param {string} params.program - Program name (e.g., "B.Tech", "BCA")
 * @param {number} params.semester - Semester number
 * @param {Array}  params.subjects - Known subjects from AcademicKnowledge cache
 * @param {string} params.pdfText - Extracted text from the routine PDF
 * @returns {string} - Complete prompt string
 */
const buildPrompt = ({ college, department, program, semester, subjects, pdfText }) => {
  const subjectList = formatSubjectList(subjects);

  const prompt = `You are an expert academic schedule parser. Your task is to extract a weekly class routine/timetable from the provided PDF text and return it as structured JSON.

ACADEMIC CONTEXT:
- College: ${college || 'Unknown'}
- Department: ${department || 'Unknown'}
- Program: ${program || 'Unknown'}
- Semester: ${semester || 'Unknown'}

KNOWN SUBJECTS FOR THIS SEMESTER:
${subjectList || 'No subject data available. Infer subjects from the PDF content.'}

INSTRUCTIONS:
1. Parse the PDF text below and extract ALL classes/periods from the weekly timetable.
2. For each class entry, determine: the day of the week, subject/course title, class type, start time, end time, faculty/instructor name, and room/lab number.
3. Use the known subjects list above to match and normalize subject names. If a subject in the PDF is abbreviated or misspelled, map it to the closest known subject.
4. If a field (faculty, room) is not available in the PDF, set it to an empty string "".
5. Use 24-hour time format (HH:MM) for startTime and endTime.
6. Day names must be full English names with proper capitalization: "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday".
7. The "type" field must be one of: "theory", "lab", or "tutorial". Infer from context if not explicitly stated (e.g., practical/laboratory = "lab", lecture = "theory").
8. Do NOT include break periods, lunch hours, or free periods.

OUTPUT FORMAT:
You MUST output ONLY valid JSON with no markdown formatting, no code fences, no explanations, no text before or after the JSON. Output exactly this structure:

{"classes":[{"day":"Monday","title":"Database Management Systems","type":"theory","startTime":"09:00","endTime":"10:00","faculty":"Dr. Smith","room":"Room 301"}]}

Each object in the "classes" array must have these exact keys: "day", "title", "type", "startTime", "endTime", "faculty", "room".

EXTRACTED PDF TEXT:
---
${pdfText}
---

Remember: Output ONLY the JSON object. No other text.`;

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
