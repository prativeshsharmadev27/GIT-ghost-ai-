const { z } = require('zod');

const githubIssueUrlSchema = z
  .string()
  .url('Enter a valid GitHub issue URL.')
  .refine((value) => {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && url.hostname === 'github.com';
    } catch {
      return false;
    }
  }, 'URL must start with https://github.com/');

const analyzeRequestSchema = z.object({
  issueTitle: z.string().trim().min(1, 'Issue title is required.').max(500),
  issueDescription: z.string().trim().max(20000).default(''),
  repositoryContext: z.string().trim().max(10000).optional().default(''),
  issueUrl: z.string().trim().url().max(2048).optional().or(z.literal('')),
  language: z.enum(['english', 'hinglish']).default('english'),
});

module.exports = { githubIssueUrlSchema, analyzeRequestSchema };
