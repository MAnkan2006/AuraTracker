const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODEL_NAME = "gemini-3.5-flash";

/**
 * Send a prompt to Gemini and parse the response as JSON.
 * Retries once on JSON parse failure with an appended instruction.
 *
 * @param {string} prompt - The full prompt string
 * @returns {Promise<Object>} - Parsed JSON object with { classes: [] }
 */
const generateRoutine = async (prompt) => {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  // First attempt
  let responseText = await callGemini(model, prompt);
  let parsed = tryParseJSON(responseText);

  if (parsed) {
    return parsed;
  }

  // Retry once with explicit JSON instruction
  console.log(
    "[GeminiService] First parse failed, retrying with JSON instruction...",
  );
  const retryPrompt =
    prompt +
    "\n\nIMPORTANT: Your previous response was not valid JSON. Please output valid JSON only. No markdown, no code fences, no explanations. Just the raw JSON object.";

  responseText = await callGemini(model, retryPrompt);
  parsed = tryParseJSON(responseText);

  if (parsed) {
    return parsed;
  }

  throw new Error(
    "Failed to parse Gemini response as valid JSON after 2 attempts. The AI may not have been able to extract a routine from this PDF.",
  );
};

/**
 * Call the Gemini model and return raw response text.
 * @param {Object} model - Gemini model instance
 * @param {string} prompt - Prompt string
 * @returns {Promise<string>} - Raw response text
 */
const callGemini = async (model, prompt) => {
  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
};

/**
 * Attempt to parse a string as JSON.
 * Handles common issues like markdown code fences wrapping JSON.
 * @param {string} text - Raw text to parse
 * @returns {Object|null} - Parsed object or null
 */
const tryParseJSON = (text) => {
  if (!text || text.trim().length === 0) return null;

  let cleaned = text.trim();

  // Strip markdown code fences if present (```json ... ``` or ``` ... ```)
  const codeFenceRegex = /^```(?:json)?\s*\n?([\s\S]*?)\n?\s*```$/;
  const match = cleaned.match(codeFenceRegex);
  if (match) {
    cleaned = match[1].trim();
  }

  // Try direct parse
  try {
    const parsed = JSON.parse(cleaned);
    if (parsed && typeof parsed === "object") {
      return parsed;
    }
  } catch (e) {
    // Fall through to extraction attempt
  }

  // Try to extract JSON object from surrounding text
  const jsonObjectRegex = /\{[\s\S]*"classes"\s*:\s*\[[\s\S]*\]\s*\}/;
  const objMatch = cleaned.match(jsonObjectRegex);
  if (objMatch) {
    try {
      const parsed = JSON.parse(objMatch[0]);
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    } catch (e) {
      // Give up
    }
  }

  return null;
};

module.exports = { generateRoutine };
