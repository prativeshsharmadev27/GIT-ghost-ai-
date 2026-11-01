const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')

async function request(path, options = {}) {
  let response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    })
  } catch {
    throw new Error('Could not reach the GitGhost API. Make sure the server is running and try again.')
  }

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(payload.error || `Request failed (${response.status}). Please try again.`)
    error.status = response.status
    error.code = payload.code
    throw error
  }
  return payload
}

export function fetchIssue(url) {
  return request(`/github/issue?url=${encodeURIComponent(url)}`)
}

export function analyzeIssue(body) {
  return request('/analyze', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function chatWithMentor(body) {
  return request('/chat', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
