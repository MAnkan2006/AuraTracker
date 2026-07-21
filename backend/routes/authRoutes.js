const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/google', authController.googleLogin);
router.get('/google/callback', authController.googleCallback);

router.get('/github', authController.githubLogin);
router.get('/github/callback', authController.githubCallback);

module.exports = router;
