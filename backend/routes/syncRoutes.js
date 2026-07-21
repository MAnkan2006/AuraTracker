const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const syncController = require('../controllers/syncController');

// GET /api/sync — Get user's saved state
router.get('/', verifyToken, syncController.getState);

// POST /api/sync — Save user's state
router.post('/', verifyToken, syncController.saveState);

module.exports = router;
