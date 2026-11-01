const test = require('node:test');
const assert = require('node:assert/strict');
const { fetchGitHubIssue, parseIssueUrl } = require('../services/githubService');

async function withMockedFetch(mockFetch, callback) {
  const originalFetch = global.fetch;
  global.fetch = mockFetch;
  try {
    return await callback();
  } finally {
    global.fetch = originalFetch;
  }
}

test('parses valid GitHub issue URLs', () => {
  assert.deepEqual(
    parseIssueUrl('https://github.com/acme/widget/issues/42'),
    { owner: 'acme', repository: 'widget', number: '42' },
  );
  assert.deepEqual(
    parseIssueUrl('https://github.com/acme/widget/issues/42/'),
    { owner: 'acme', repository: 'widget', number: '42' },
  );
});

test('rejects non-issue, non-HTTPS, and lookalike GitHub URLs', () => {
  for (const url of [
    'not a URL',
    'http://github.com/acme/widget/issues/42',
    'https://github.com.example.com/acme/widget/issues/42',
    'https://github.com/acme/widget/pull/42',
    'https://github.com/acme/widget/issues/42?tab=comments',
  ]) {
    assert.throws(() => parseIssueUrl(url), { status: 400 }, url);
  }
});

test('fetches and normalizes GitHub issue details', async () => {
  await withMockedFetch(async (url, options) => {
    assert.equal(url, 'https://api.github.com/repos/acme/widget/issues/42');
    assert.equal(options.headers.Accept, 'application/vnd.github+json');
    return new Response(JSON.stringify({
      title: 'Fix a bug',
      body: null,
      labels: [{ name: 'bug' }, { name: 'good first issue' }],
      state: 'open',
      html_url: 'https://github.com/acme/widget/issues/42',
      number: 42,
    }), { status: 200 });
  }, async () => {
    const issue = await fetchGitHubIssue('https://github.com/acme/widget/issues/42');
    assert.deepEqual(issue, {
      title: 'Fix a bug',
      body: '',
      labels: ['bug', 'good first issue'],
      state: 'open',
      html_url: 'https://github.com/acme/widget/issues/42',
      repository: 'acme/widget',
      number: 42,
    });
  });
});

test('rejects pull requests and reports GitHub rate limiting', async (t) => {
  await t.test('pull requests', async () => {
    await withMockedFetch(async () => new Response(JSON.stringify({
      title: 'A pull request',
      pull_request: { url: 'https://api.github.com/repos/acme/widget/pulls/42' },
    }), { status: 200 }), async () => {
      await assert.rejects(
        fetchGitHubIssue('https://github.com/acme/widget/issues/42'),
        { status: 422, message: 'This is a PR, not an issue.' },
      );
    });
  });

  await t.test('rate limits', async () => {
    await withMockedFetch(async () => new Response('{}', {
      status: 403,
      headers: { 'x-ratelimit-remaining': '0' },
    }), async () => {
      await assert.rejects(
        fetchGitHubIssue('https://github.com/acme/widget/issues/42'),
        { status: 429 },
      );
    });
  });
});

test('translates GitHub network failures into a retryable API error', async () => {
  await withMockedFetch(async () => {
    throw new Error('network unavailable');
  }, async () => {
    await assert.rejects(
      fetchGitHubIssue('https://github.com/acme/widget/issues/42'),
      { status: 502, message: 'Could not reach GitHub. Check your connection and try again.' },
    );
  });
});
