const { GoogleGenAI } = require('@google/genai');

const MODEL_NAME = 'gemini-3.6-flash'; // update this constant to change the model globally

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Response schema enforced by Gemini's structured-output mode.
 * Mirrors the shape expected by routineValidator.js.
 */
const ROUTINE_SCHEMA = {
  type: 'object',
  properties: {
    classes: {
      type: 'array',
      items: {
        type: 'object',
        required: ['day', 'title', 'startTime', 'endTime'],
        properties: {
          day: {
            type: 'string',
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
          },
          title:     { type: 'string' },
          type:      { type: 'string', enum: ['theory', 'lab', 'tutorial'] },
          startTime: { type: 'string', description: 'HH:MM in 24-hour format' },
          endTime:   { type: 'string', description: 'HH:MM in 24-hour format' },
          faculty:   { type: 'string' },
          room:      { type: 'string' }
        }
      }
    }
  },
  required: ['classes']
};

/**
 * Send a prompt (+ optional raw file) to Gemini and return the parsed
 * JSON object { classes: [...] }.
 *
 * @param {string}      prompt - Full text prompt from promptBuilder
 * @param {{ mimeType: string, data: string }|null} file
 *   - Prepared file object from pdfService.prepareFileForGemini, or null
 *     for a text-only call.
 * @returns {Promise<Object>} - Parsed JSON: { classes: [] }
 */
const generateRoutine = async (prompt, file = null) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set. Cannot call Gemini AI.');
  }

  // Build content parts
  const parts = [{ text: prompt }];

  if (file) {
    parts.push({
      inlineData: {
        mimeType: file.mimeType,
        data: file.data
      }
    });
    console.log(
      `[GeminiService] Sending request — model: ${MODEL_NAME}, ` +
      `file mimeType: ${file.mimeType}, ` +
      `payload size: ~${Math.round((file.data.length * 3) / 4 / 1024)} KB`
    );
  } else {
    console.log(`[GeminiService] Sending text-only request — model: ${MODEL_NAME}`);
  }

  let responseText;
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: 'user', parts }],
      config: {
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: ROUTINE_SCHEMA
      }
    });
    responseText = response.text();
  } catch (err) {
    // Surface Gemini API errors (auth, quota, model not found) clearly
    throw new Error(`Gemini API call failed: ${err.message}`);
  }

  console.log(
    '[GeminiService] Raw response (first 500 chars):',
    responseText ? responseText.substring(0, 500) : '(empty)'
  );

  const parsed = tryParseJSON(responseText);
  if (parsed) return parsed;

  throw new Error(
    'Failed to parse Gemini response as valid JSON. ' +
    'The AI may not have been able to extract a routine from this PDF. ' +
    'Check server logs for the raw AI response.'
  );
};

/**
 * Attempt to parse a string as JSON with multiple fallback strategies.
 *
 * @param {string} text
 * @returns {Object|null}
 */
const tryParseJSON = (text) => {
  if (!text || text.trim().length === 0) return null;

  const cleaned = text.trim();

  // Direct parse (expected path when responseMimeType=application/json)
  try {
    const parsed = JSON.parse(cleaned);
    if (parsed && typeof parsed === 'object') return parsed;
  } catch (_) {}

  // Fallback: strip markdown code fence, try again
  const fenceMatch = cleaned.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (fenceMatch) {
    try {
      const parsed = JSON.parse(fenceMatch[1].trim());
      if (parsed && typeof parsed === 'object') return parsed;
    } catch (_) {}
  }

  // Fallback: extract first { … } substring that contains "classes"
  const jsonObjectRegex = /\{[\s\S]*"classes"\s*:\s*\[[\s\S]*\]\s*\}/;
  const objMatch = cleaned.match(jsonObjectRegex);
  if (objMatch) {
    try {
      const parsed = JSON.parse(objMatch[0]);
      if (parsed && typeof parsed === 'object') return parsed;
    } catch (_) {}
  }

  return null;
};

module.exports = { generateRoutine };
