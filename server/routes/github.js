const express = require('express');
const { githubIssueUrlSchema } = require('../validators/issueValidator');
const { fetchGitHubIssue } = require('../services/githubService');

const router = express.Router();

router.get('/issue', async (request, response, next) => {
  const parsed = githubIssueUrlSchema.safeParse(request.query.url);
  if (!parsed.success) {
    return response.status(400).json({
      error: parsed.error.issues[0]?.message || 'A valid GitHub issue URL is required.',
      code: 'INVALID_ISSUE_URL',
    });
  }

  try {
    const issue = await fetchGitHubIssue(parsed.data);
    return response.json(issue);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
