/**
 * Extract images from a PDF buffer.
 * @param {Buffer} buffer - The PDF file buffer
 * @returns {Promise<Object>} - Object containing base64 images
 */
const extractData = async (buffer) => {
  if (!buffer || buffer.length === 0) {
    throw new Error('Empty PDF buffer provided');
  }

  console.log("[PDFService] Extracting images from PDF...");
  try {
    const { pdf } = await import('pdf-to-img');
    const document = await pdf(buffer, { scale: 2 });
    const base64Images = [];
    for await (const imageBuffer of document) {
      base64Images.push(`data:image/png;base64,${imageBuffer.toString('base64')}`);
    }
    return { type: 'images', images: base64Images };
  } catch (err) {
    throw new Error('Image extraction failed: ' + err.message);
  }
};

module.exports = { extractData };
