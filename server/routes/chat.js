const express = require('express');
const { chatRequestSchema } = require('../validators/issueValidator');
const { askMentor } = require('../services/mentorService');

const router = express.Router();

router.post('/', async (request, response, next) => {
  const parsed = chatRequestSchema.safeParse(request.body);
  if (!parsed.success) {
    return response.status(400).json({
      error: parsed.error.issues[0]?.message || 'Please provide a valid mentor chat message.',
      code: 'INVALID_CHAT_REQUEST',
    });
  }

  try {
    const answer = await askMentor(parsed.data);
    return response.json({ answer });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
