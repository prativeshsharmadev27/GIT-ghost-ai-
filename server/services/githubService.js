const GITHUB_API = 'https://api.github.com';

function parseIssueUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    const error = new Error('Enter a valid GitHub issue URL.');
    error.status = 400;
    throw error;
  }

  const match = url.pathname.match(/^\/([^/]+)\/([^/]+)\/issues\/(\d+)\/?$/);
  if (
    url.protocol !== 'https:' ||
    url.hostname !== 'github.com' ||
    !match ||
    url.search ||
    url.hash
  ) {
    const error = new Error('Use an issue URL like https://github.com/owner/repository/issues/123.');
    error.status = 400;
    throw error;
  }

  return { owner: match[1], repository: match[2], number: match[3] };
}

async function fetchGitHubIssue(issueUrl) {
  const { owner, repository, number } = parseIssueUrl(issueUrl);
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'GitGhost-AI',
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  let response;
  try {
    response = await fetch(
      `${GITHUB_API}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}/issues/${number}`,
      { headers, signal: AbortSignal.timeout(10000) },
    );
  } catch (cause) {
    const error = new Error('Could not reach GitHub. Check your connection and try again.');
    error.status = 502;
    error.cause = cause;
    throw error;
  }

  if (response.status === 404) {
    const error = new Error('Issue not found. It may be private, deleted, or the URL may be incorrect.');
    error.status = 404;
    throw error;
  }
  if (response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0') {
    const error = new Error('GitHub API rate limit reached. Try again later or configure GITHUB_TOKEN in server/.env.');
    error.status = 429;
    throw error;
  }
  if (!response.ok) {
    const error = new Error(`GitHub returned an error (${response.status}). Please try again later.`);
    error.status = response.status === 403 ? 403 : 502;
    throw error;
  }

  const issue = await response.json();
  if (issue.pull_request) {
    const error = new Error('This is a PR, not an issue.');
    error.status = 422;
    throw error;
  }

  return {
    title: issue.title,
    body: issue.body || '',
    labels: (issue.labels || []).map((label) => (
      typeof label === 'string' ? label : label.name
    )),
    state: issue.state,
    html_url: issue.html_url,
    repository: `${owner}/${repository}`,
    number: issue.number,
  };
}

module.exports = { fetchGitHubIssue, parseIssueUrl };
