const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const VISION_MODEL = "qwen/qwen3.6-27b";
const TEXT_MODEL   = "llama3-70b-8192";
const MAX_TOKENS   = 8192;

/**
 * Send a prompt (+ optional images) to the Groq model and parse the
 * response as JSON.  Retries once on JSON-parse failure with an
 * explicit JSON-only instruction appended to the prompt.
 *
 * @param {string}   prompt       - The full prompt string
 * @param {string[]} base64Images - Array of base64 data-URIs (images)
 * @returns {Promise<Object>}      - Parsed JSON object with { classes: [] }
 */
const generateRoutine = async (prompt, base64Images = []) => {
  // ── Attempt 1 ──────────────────────────────────────────────────────
  let responseText;
  try {
    responseText = await callGroq(prompt, base64Images);
  } catch (err) {
    // Surface API-level failures (auth, model not found, rate limit) clearly
    throw new Error(`Groq API call failed: ${err.message}`);
  }

  console.log(
    "[GroqService] Raw AI response (attempt 1):",
    responseText ? responseText.substring(0, 500) : "(empty)"
  );

  const parsed1 = tryParseJSON(responseText);
  if (parsed1) return parsed1;

  // ── Attempt 2 – retry with explicit JSON instruction ───────────────
  console.log("[GroqService] First parse failed – retrying with JSON instruction …");

  const retryPrompt =
    prompt +
    "\n\nIMPORTANT: Your previous response was not valid JSON. " +
    "Please output valid JSON ONLY. No markdown, no code fences, " +
    "no explanations, no <think> blocks. Just the raw JSON object.";

  let responseText2;
  try {
    responseText2 = await callGroq(retryPrompt, base64Images);
  } catch (err) {
    throw new Error(`Groq API call failed on retry: ${err.message}`);
  }

  console.log(
    "[GroqService] Raw AI response (attempt 2):",
    responseText2 ? responseText2.substring(0, 500) : "(empty)"
  );

  const parsed2 = tryParseJSON(responseText2);
  if (parsed2) return parsed2;

  throw new Error(
    "Failed to parse Groq AI response as valid JSON after 2 attempts. " +
    "The AI may not have been able to extract a routine from this image. " +
    "Check server logs for the raw AI response."
  );
};

/**
 * Call the appropriate Groq model and return the raw response text.
 *
 * @param {string}   prompt       - Prompt string
 * @param {string[]} base64Images - Array of base64 data-URIs
 * @returns {Promise<string>}     - Raw response text
 */
const callGroq = async (prompt, base64Images = []) => {
  let messages;
  let modelToUse = TEXT_MODEL;

  if (base64Images.length > 0) {
    // Vision path: attach each image after the text prompt
    const content = [{ type: "text", text: prompt }];
    for (const dataUri of base64Images) {
      content.push({ type: "image_url", image_url: { url: dataUri } });
    }
    messages    = [{ role: "user", content }];
    modelToUse  = VISION_MODEL;
  } else {
    messages = [{ role: "user", content: prompt }];
  }

  const result = await groq.chat.completions.create({
    messages,
    model: modelToUse,
    temperature: 0.2,
    max_tokens: MAX_TOKENS,
    // NOTE: response_format: { type: 'json_object' } is intentionally
    // omitted here – Qwen's reasoning model emits <think> blocks before
    // the JSON, which causes Groq to reject the response with a 400 when
    // that mode is active.  We strip the think block ourselves instead.
  });

  const choice     = result.choices[0];
  const finishReason = choice.finish_reason;

  if (finishReason === "length") {
    console.warn(
      `[GroqService] WARNING: model response was TRUNCATED (finish_reason='length'). ` +
      `Increase MAX_TOKENS or simplify the PDF. ` +
      `Tokens used: ${result.usage?.total_tokens ?? "unknown"}`
    );
  }

  return choice.message.content;
};

/**
 * Attempt to parse a string as JSON.
 *
 * Handles:
 *  - Qwen <think>...</think> reasoning blocks (closed and UNCLOSED/truncated)
 *  - Markdown code fences (```json ... ```)
 *  - JSON embedded inside surrounding prose
 *
 * @param {string} text - Raw text from the model
 * @returns {Object|null} - Parsed object, or null if all attempts fail
 */
const tryParseJSON = (text) => {
  if (!text || text.trim().length === 0) return null;

  let cleaned = text.trim();

  // ── Detect unclosed <think> block (truncated response) ─────────────
  const hasOpenThink   = /<think>/i.test(cleaned);
  const hasClosedThink = /<\/think>/i.test(cleaned);
  if (hasOpenThink && !hasClosedThink) {
    // The model's reasoning was cut off mid-stream; no JSON can follow.
    console.error(
      "[GroqService] Response was TRUNCATED inside a <think> block – " +
      "no JSON content is present. Increase max_tokens."
    );
    return null;
  }

  // ── Strip closed <think>...</think> blocks ──────────────────────────
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

  // ── Attempt 1: direct JSON parse ────────────────────────────────────
  try {
    const parsed = JSON.parse(cleaned);
    if (parsed && typeof parsed === "object") return parsed;
  } catch (_) {
    // fall through
  }

  // ── Attempt 2: strip markdown code fence then parse ─────────────────
  const fenceMatch = cleaned.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (fenceMatch) {
    try {
      const parsed = JSON.parse(fenceMatch[1].trim());
      if (parsed && typeof parsed === "object") return parsed;
    } catch (_) {
      // fall through
    }
  }

  // ── Attempt 3: extract first '{' … last '}' substring ───────────────
  const firstBrace = cleaned.indexOf("{");
  const lastBrace  = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    try {
      const parsed = JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
      if (parsed && typeof parsed === "object") return parsed;
    } catch (_) {
      // give up
    }
  }

  return null;
};

module.exports = { generateRoutine };
