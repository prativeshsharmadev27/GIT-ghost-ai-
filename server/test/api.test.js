const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../index');

const server = app.listen(0, '127.0.0.1');
const serverReady = new Promise((resolve, reject) => {
  server.once('listening', resolve);
  server.once('error', reject);
});

test.after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

async function request(path, options) {
  await serverReady;
  const { port } = server.address();
  return fetch(`http://127.0.0.1:${port}${path}`, options);
}

test('health endpoint returns status and an ISO timestamp', async () => {
  const response = await request('/api/health');
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.status, 'ok');
  assert.equal(Number.isNaN(Date.parse(payload.timestamp)), false);
});

test('GitHub endpoint rejects invalid URLs before making an upstream request', async () => {
  const response = await request('/api/github/issue?url=http%3A%2F%2Fgithub.com%2Facme%2Fwidget%2Fissues%2F42');
  const payload = await response.json();

  assert.equal(response.status, 400);
  assert.equal(payload.code, 'INVALID_ISSUE_URL');
});

test('analysis endpoint validates the body and language', async () => {
  const response = await request('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      issueTitle: 'A valid title',
      issueDescription: 'A description',
      language: 'klingon',
    }),
  });
  const payload = await response.json();

  assert.equal(response.status, 400);
  assert.equal(payload.code, 'INVALID_ANALYSIS_REQUEST');
});

test('analysis endpoint reports missing Gemini configuration clearly', async () => {
  const originalKey = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;
  try {
    const response = await request('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        issueTitle: 'A valid title',
        issueDescription: 'A description',
        language: 'english',
      }),
    });
    const payload = await response.json();

    assert.equal(response.status, 503);
    assert.equal(payload.code, 'MISSING_API_KEY');
    assert.match(payload.error, /GEMINI_API_KEY/);
  } finally {
    if (originalKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = originalKey;
  }
});

test('chat endpoint validates conversation messages before calling Gemini', async () => {
  const response = await request('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      issue: { title: 'Help me understand this issue' },
      messages: [{ role: 'assistant', content: 'What do you need help with?' }],
      language: 'english',
    }),
  });
  const payload = await response.json();

  assert.equal(response.status, 400);
  assert.equal(payload.code, 'INVALID_CHAT_REQUEST');
});

test('chat endpoint reports missing Gemini configuration clearly', async () => {
  const originalKey = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;
  try {
    const response = await request('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        issue: { title: 'Fix the navbar', description: 'It overlaps on mobile.' },
        analysis: { summary: 'Fix responsive navigation.' },
        messages: [{ role: 'user', content: 'What should I do first?' }],
        language: 'hinglish',
      }),
    });
    const payload = await response.json();

    assert.equal(response.status, 503);
    assert.equal(payload.code, 'MISSING_API_KEY');
    assert.match(payload.error, /GEMINI_API_KEY/);
  } finally {
    if (originalKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = originalKey;
  }
});

test('JSON body parser enforces the 50kb request size limit', async () => {
  const response = await request('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      issueTitle: 'Large payload',
      issueDescription: 'x'.repeat(51 * 1024),
      language: 'english',
    }),
  });

  assert.equal(response.status, 413);
});
