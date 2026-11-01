import { ArrowUpRight, CheckCircle2, FileText, GitBranch, LoaderCircle, Sparkles } from 'lucide-react'
import { useState } from 'react'
import demoIssue from '../data/demoIssue'

export default function IssueInput({ onFetchIssue, onAnalyze, loading, error, issueData, clearError }) {
  const [mode, setMode] = useState('github')
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [repositoryContext, setRepositoryContext] = useState('')
  const [language, setLanguage] = useState('english')
  const [localError, setLocalError] = useState('')
  const [fetching, setFetching] = useState(false)
  const [fetchedIssue, setFetchedIssue] = useState(null)
  const [lastSubmitted, setLastSubmitted] = useState(null)

  async function fetchIssue() {
    setLocalError('')
    clearError?.()
    if (!url.trim()) {
      setLocalError('Paste a GitHub issue URL to fetch its details.')
      return
    }
    setFetching(true)
    try {
      const issue = await onFetchIssue(url.trim())
      setFetchedIssue(issue)
      setTitle(issue.title)
      setDescription(issue.body)
    } catch {
      setFetchedIssue(null)
    } finally {
      setFetching(false)
    }
  }

  function submitIssue() {
    setLocalError('')
    clearError?.()
    if (mode === 'github' && !fetchedIssue) {
      setLocalError('Fetch the GitHub issue first so the analysis uses the correct issue details.')
      return
    }
    const issueTitle = mode === 'github' ? fetchedIssue.title : title.trim()
    const issueDescription = mode === 'github' ? fetchedIssue.body : description.trim()
    if (!issueTitle || !issueDescription) {
      setLocalError('Add an issue title and description before analyzing.')
      return
    }
    const request = {
      issueTitle,
      issueDescription,
      repositoryContext: repositoryContext.trim(),
      issueUrl: mode === 'github' ? fetchedIssue.html_url : '',
      language,
    }
    setLastSubmitted(request)
    onAnalyze(request)
  }

  function tryDemo() {
    setMode('paste')
    setUrl(demoIssue.url)
    setTitle(demoIssue.title)
    setDescription(demoIssue.body)
    setRepositoryContext('React application with a responsive navigation bar.')
    setFetchedIssue({
      title: demoIssue.title,
      body: demoIssue.body,
      html_url: demoIssue.url,
      repository: 'demo/repo',
      labels: ['good first issue', 'responsive design'],
      state: 'open',
    })
    setLocalError('')
    clearError?.()
    const request = {
      issueTitle: demoIssue.title,
      issueDescription: demoIssue.body,
      repositoryContext: 'React application with a responsive navigation bar.',
      issueUrl: demoIssue.url,
      language,
    }
    setLastSubmitted(request)
    onAnalyze(request)
  }

  const shownIssue = fetchedIssue || (issueData?.html_url ? issueData : null)
  const message = localError || error?.message

  return (
    <section className="panel issue-input-panel">
      <div className="panel-topline"><span className="section-eyebrow"><span className="eyebrow-dot" /> START HERE</span><span className="step-count">01 <span>/</span> 02</span></div>
      <h2 className="panel-title">Bring an issue to life</h2>
      <p className="panel-subtitle">Drop in an issue and your ghost guide will map out a contributor-friendly plan.</p>
      <div className="input-tabs" role="tablist" aria-label="Issue input type">
        <button role="tab" aria-selected={mode === 'github'} className={mode === 'github' ? 'input-tab active' : 'input-tab'} onClick={() => { setMode('github'); setLocalError('') }}><GitBranch size={16} /> GitHub URL</button>
        <button role="tab" aria-selected={mode === 'paste'} className={mode === 'paste' ? 'input-tab active' : 'input-tab'} onClick={() => { setMode('paste'); setLocalError('') }}><FileText size={16} /> Paste description</button>
      </div>

      {mode === 'github' ? (
        <div className="field-group">
          <label htmlFor="github-issue-url">GitHub issue URL</label>
          <div className="url-input-row">
            <input id="github-issue-url" type="url" value={url} onChange={(event) => { setUrl(event.target.value); setFetchedIssue(null) }} placeholder="https://github.com/owner/repo/issues/42" />
            <button className="button button-secondary fetch-button" onClick={fetchIssue} disabled={loading || fetching}>{fetching ? <LoaderCircle className="spin" size={16} /> : <ArrowUpRight size={16} />}<span>{fetching ? 'Fetching…' : 'Fetch issue'}</span></button>
          </div>
        </div>
      ) : (
        <>
          <div className="field-group"><label htmlFor="issue-title">Issue title</label><input id="issue-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Improve keyboard navigation in the menu" maxLength={500} /></div>
          <div className="field-group"><label htmlFor="issue-description">What needs to be done?</label><textarea id="issue-description" rows={5} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Paste the issue description, acceptance criteria, or reproduction steps…" maxLength={20000} /></div>
        </>
      )}

      <div className="field-group"><label htmlFor="repository-context">Repository context <span className="optional">OPTIONAL</span></label><textarea id="repository-context" rows={2} value={repositoryContext} onChange={(event) => setRepositoryContext(event.target.value)} placeholder="Tech stack, relevant files, or anything else that might help…" maxLength={10000} /></div>
      <div className="form-footer">
        <label className="language-select" htmlFor="analysis-language"><span>Explain in</span><select id="analysis-language" value={language} onChange={(event) => setLanguage(event.target.value)}><option value="english">English</option><option value="hinglish">Hinglish</option></select></label>
        <button className="demo-link" onClick={tryDemo} disabled={loading}><Sparkles size={15} /> Try demo issue</button>
      </div>

      {shownIssue && <div className="issue-preview"><CheckCircle2 size={17} /><div><strong>{shownIssue.title}</strong><span>{shownIssue.repository || 'Issue preview'}{shownIssue.labels?.length ? ` · ${shownIssue.labels.slice(0, 3).join(', ')}` : ''}</span></div></div>}
      {message && <div className={`inline-alert ${error?.code === 'MISSING_API_KEY' ? 'setup-alert' : ''}`} role="alert"><strong>{error?.code === 'MISSING_API_KEY' ? 'Setup required' : 'Could not continue'}</strong><span>{message}</span>{error?.code === 'MISSING_API_KEY' && <span className="alert-help">Add your key to <code>server/.env</code>, then restart the API.</span>}{error && lastSubmitted && error.code !== 'MISSING_API_KEY' && <button className="retry-button" onClick={() => onAnalyze(lastSubmitted)} disabled={loading}>Try analysis again</button>}</div>}
      <button className="button button-primary analyze-button" onClick={submitIssue} disabled={loading || fetching}>{loading ? <><LoaderCircle className="spin" size={17} /> Reading the issue…</> : <><Sparkles size={17} /> Analyze this issue <ArrowUpRight size={16} /></>}</button>
      <p className="privacy-note"><span className="privacy-lock">⌑</span> Your Gemini key stays on the server. Issue text is sent to Gemini for analysis.</p>
    </section>
  )
}
