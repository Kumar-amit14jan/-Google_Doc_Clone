const express = require('express');
const router = express.Router();
const genAI = require('../controller/geminiAPIIntegration');
router.post('/enhanceText', genAI.GoogleGenAI);
module.exports = router;