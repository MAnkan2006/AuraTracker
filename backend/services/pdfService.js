/**
 * Prepare an uploaded file (PDF or image) for the Gemini API.
 * Returns a plain object with the base64-encoded data and MIME type —
 * no rasterization, no text extraction.  Gemini's native PDF support
 * handles the file directly.
 *
 * @param {Buffer} buffer   - Raw file buffer from multer
 * @param {string} mimetype - MIME type reported by multer (e.g. 'application/pdf')
 * @returns {{ mimeType: string, data: string }} - Ready-to-use inlineData object
 */
const prepareFileForGemini = (buffer, mimetype) => {
  if (!buffer || buffer.length === 0) {
    throw new Error('Empty file buffer provided');
  }

  return {
    mimeType: mimetype,
    data: buffer.toString('base64')
  };
};

module.exports = { prepareFileForGemini };
