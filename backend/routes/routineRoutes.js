const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const upload = require('../middleware/upload');
const routineController = require('../controllers/routineController');

// POST /api/routine/import — Upload PDF and extract routine via AI
router.post('/import', verifyToken, upload.single('pdf'), routineController.importRoutine);

// POST /api/routine/confirm — Save confirmed routine to database
router.post('/confirm', verifyToken, routineController.confirmRoutine);

// GET /api/routine — Get user's saved routine
router.get('/', verifyToken, routineController.getRoutine);

// PUT /api/routine — Update user's routine classes
router.put('/', verifyToken, routineController.updateRoutine);

// Handle multer errors (file too large, wrong type)
router.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: 'File is too large. Maximum size is 10MB.'
    });
  }

  if (err.message === 'Only PDF files are allowed') {
    return res.status(415).json({
      success: false,
      message: 'Only PDF files are allowed.'
    });
  }

  next(err);
});

module.exports = router;
