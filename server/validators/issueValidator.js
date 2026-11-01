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

const chatRequestSchema = z.object({
  issue: z.object({
    title: z.string().trim().min(1).max(500),
    description: z.string().trim().max(20000).default(''),
    repositoryContext: z.string().trim().max(10000).optional().default(''),
    url: z.string().trim().max(2048).optional().default(''),
  }),
  analysis: z.object({
    summary: z.string().max(3000).optional().default(''),
    difficulty: z.string().max(50).optional().default(''),
    suggestedApproach: z.string().max(5000).optional().default(''),
    roadmap: z.array(z.object({
      title: z.string().max(300),
      description: z.string().max(1500),
    })).max(12).optional().default([]),
  }).optional().default({}),
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().trim().min(1).max(2000),
  })).min(1).max(12).refine(
    (messages) => messages[messages.length - 1]?.role === 'user',
    'The latest chat message must be from the user.',
  ),
  language: z.enum(['english', 'hinglish']).default('english'),
});

module.exports = { githubIssueUrlSchema, analyzeRequestSchema, chatRequestSchema };
