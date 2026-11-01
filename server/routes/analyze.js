const express = require('express');
const { analyzeRequestSchema } = require('../validators/issueValidator');
const { analyzeIssue } = require('../services/geminiService');

const router = express.Router();

router.post('/', async (request, response, next) => {
  const parsed = analyzeRequestSchema.safeParse(request.body);
  if (!parsed.success) {
    return response.status(400).json({
      error: parsed.error.issues[0]?.message || 'Please provide a valid issue to analyze.',
      code: 'INVALID_ANALYSIS_REQUEST',
    });
  }

  try {
    const analysis = await analyzeIssue(parsed.data, parsed.data.language);
    return response.json(analysis);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
