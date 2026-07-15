const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const onboardingController = require('../controllers/onboardingController');

router.get('/', verifyToken, onboardingController.getOnboarding);
router.post('/', verifyToken, onboardingController.saveOnboarding);

module.exports = router;
