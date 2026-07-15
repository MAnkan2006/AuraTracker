const pdfParse = require('pdf-parse');

/**
 * Extract and clean text content from a PDF buffer.
 * @param {Buffer} buffer - The PDF file buffer
 * @returns {Promise<string>} - Cleaned text content
 */
const extractText = async (buffer) => {
  if (!buffer || buffer.length === 0) {
    throw new Error('Empty PDF buffer provided');
  }

  const data = await pdfParse(buffer);

  if (!data.text || data.text.trim().length === 0) {
    throw new Error('No text content could be extracted from the PDF. The file may be image-based or empty.');
  }

  return cleanText(data.text);
};

/**
 * Clean up common PDF noise from extracted text.
 * @param {string} rawText - Raw text from pdf-parse
 * @returns {string} - Cleaned text
 */
const cleanText = (rawText) => {
  let text = rawText;

  // Remove standalone page numbers (e.g. "Page 1", "Page 1 of 5", "- 1 -", just "1" on its own line)
  text = text.replace(/^\s*page\s*\d+\s*(of\s*\d+)?\s*$/gim, '');
  text = text.replace(/^\s*-\s*\d+\s*-\s*$/gm, '');
  text = text.replace(/^\s*\d{1,3}\s*$/gm, '');

  // Remove common header/footer patterns
  text = text.replace(/^\s*(confidential|draft|internal use only)\s*$/gim, '');

  // Remove form feed and other control characters
  text = text.replace(/\f/g, '\n');
  text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');

  // Collapse multiple blank lines into a single one
  text = text.replace(/\n{3,}/g, '\n\n');

  // Collapse multiple spaces/tabs on the same line into a single space
  text = text.replace(/[^\S\n]{2,}/g, ' ');

  // Trim leading/trailing whitespace from each line
  text = text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');

  // Detect and remove repeated headers/footers (lines that appear on multiple "pages")
  text = removeRepeatedHeadersFooters(text);

  return text.trim();
};

/**
 * Detect lines that repeat many times (likely headers/footers) and remove them.
 * @param {string} text - Cleaned text
 * @returns {string} - Text with repeated headers/footers removed
 */
const removeRepeatedHeadersFooters = (text) => {
  const lines = text.split('\n');
  const lineCount = {};

  // Count occurrences of each line (normalized)
  for (const line of lines) {
    const normalized = line.trim().toLowerCase();
    if (normalized.length > 3 && normalized.length < 120) {
      lineCount[normalized] = (lineCount[normalized] || 0) + 1;
    }
  }

  // If a line appears 3+ times, it's likely a repeated header/footer
  const repeatedLines = new Set();
  for (const [line, count] of Object.entries(lineCount)) {
    if (count >= 3) {
      repeatedLines.add(line);
    }
  }

  if (repeatedLines.size === 0) return text;

  return lines
    .filter(line => !repeatedLines.has(line.trim().toLowerCase()))
    .join('\n');
};

module.exports = { extractText };
