const User = require('../models/User');
const Routine = require('../models/Routine');
const { extractData } = require('../services/pdfService');
const { buildPrompt } = require('../services/promptBuilder');
const { generateRoutine } = require('../services/groqService');
const { validateRoutine } = require('../validators/routineValidator');
const academicKnowledgeService = require('../services/academicKnowledgeService');

/**
 * POST /import
 * Upload a PDF routine, extract text, call Gemini AI to parse it,
 * validate the output, and return structured classes for confirmation.
 */
exports.importRoutine = async (req, res) => {
  try {
    // Multer validation
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please upload a routine PDF or Image.'
      });
    }

    const isDirectImage = req.file.mimetype.startsWith('image/');
    let pdfText = '';
    let base64Images = [];
    let isImage = false;

    if (isDirectImage) {
      // Direct image upload
      const base64 = req.file.buffer.toString('base64');
      const dataUri = `data:${req.file.mimetype};base64,${base64}`;
      base64Images.push(dataUri);
      pdfText = '[Image uploaded. Please parse the image for the schedule.]';
      isImage = true;
    } else {
      // PDF upload
      try {
        const pdfData = await extractData(req.file.buffer);
        if (pdfData.type === 'images') {
          base64Images = pdfData.images;
          pdfText = '[Image-based PDF attached. Please parse the images for the schedule.]';
          isImage = true;
        } else {
          pdfText = pdfData.text;
          isImage = false;
        }
      } catch (err) {
        return res.status(422).json({
          success: false,
          message: `Failed to extract data from PDF: ${err.message}`
        });
      }
    }

    // Load user's academic profile
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const profile = user.academicProfile || {};
    const { college, department, program, semester, university, section } = profile;

    // Fetch academic knowledge (subjects list) for context
    let subjects = [];
    try {
      const knowledge = await academicKnowledgeService.getOrFetch(
        college, department, semester, university
      );
      if (knowledge && knowledge.subjects) {
        subjects = knowledge.subjects;
      }
    } catch (err) {
      // Non-fatal: proceed without subject context
      console.warn('[RoutineController] Failed to fetch academic knowledge:', err.message);
    }

    // Build prompt and call Gemini (Groq)
    const prompt = buildPrompt({
      college: college || '',
      department: department || '',
      program: program || '',
      semester: semester || '',
      section: section || '',
      subjects,
      pdfText,
      isImage
    });

    let geminiResult;
    try {
      geminiResult = await generateRoutine(prompt, base64Images);
    } catch (err) {
      return res.status(502).json({
        success: false,
        message: `AI processing failed: ${err.message}`
      });
    }

    // Validate and normalize the Gemini output
    const validation = validateRoutine(geminiResult, subjects);

    if (!validation.valid) {
      return res.status(422).json({
        success: false,
        message: 'Could not extract a valid routine from the PDF.',
        errors: validation.errors,
        warnings: validation.warnings
      });
    }

    res.json({
      success: true,
      classes: validation.classes,
      warnings: validation.warnings,
      errors: validation.errors
    });
  } catch (err) {
    console.error('[RoutineController] importRoutine error:', err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * POST /confirm
 * Save the confirmed routine classes to the database.
 * Receives { classes } from frontend after user review.
 */
exports.confirmRoutine = async (req, res) => {
  try {
    let { classes } = req.body;

    // Defensive: parse if frontend accidentally sent classes as a JSON string
    if (typeof classes === 'string') {
      try { classes = JSON.parse(classes); } catch (e) {
        return res.status(400).json({ success: false, message: 'Invalid classes format — expected an array.' });
      }
    }

    if (!Array.isArray(classes) || classes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No classes provided. Please provide a valid classes array.'
      });
    }

    const userId = req.user.userId;

    // findOne + save is the most reliable upsert pattern across Mongoose versions.
    // findOneAndUpdate with mixed operators ($set + $setOnInsert) can cause 500s.
    let routine = await Routine.findOne({ userId });
    if (routine) {
      routine.classes = classes;
    } else {
      routine = new Routine({ userId, classes });
    }
    await routine.save();

    res.json({
      success: true,
      message: 'Routine saved successfully',
      routine
    });
  } catch (err) {
    console.error('[RoutineController] confirmRoutine error:', err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


/**
 * GET /
 * Retrieve the current user's saved routine.
 */
exports.getRoutine = async (req, res) => {
  try {
    const routine = await Routine.findOne({ userId: req.user.userId });

    if (!routine) {
      return res.json({
        success: true,
        routine: null,
        message: 'No routine found. Import a routine to get started.'
      });
    }

    res.json({
      success: true,
      routine
    });
  } catch (err) {
    console.error('[RoutineController] getRoutine error:', err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * PUT /
 * Update the current user's routine classes array.
 * Used for manual edits after initial import.
 */
exports.updateRoutine = async (req, res) => {
  try {
    const { classes } = req.body;

    if (!classes || !Array.isArray(classes)) {
      return res.status(400).json({
        success: false,
        message: 'A valid classes array is required.'
      });
    }

    const userId = req.user.userId;

    const routine = await Routine.findOneAndUpdate(
      { userId },
      { $set: { classes } },
      { new: true }
    );

    if (!routine) {
      return res.status(404).json({
        success: false,
        message: 'No routine found. Please import or confirm a routine first.'
      });
    }

    res.json({
      success: true,
      message: 'Routine updated successfully',
      routine
    });
  } catch (err) {
    console.error('[RoutineController] updateRoutine error:', err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
