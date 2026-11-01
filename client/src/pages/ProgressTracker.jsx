import { ArrowUpRight, CheckCircle2, Circle, Trash2 } from 'lucide-react'
import { useState } from 'react'

function readProgressEntries() {
  const entries = []
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index)
    if (!key?.startsWith('gitghost_progress_')) continue
    try {
      const progress = JSON.parse(localStorage.getItem(key))
      if (progress && Array.isArray(progress.completed)) entries.push({ ...progress, key })
    } catch {
      continue
    }
  }
  return entries.sort((left, right) => new Date(right.updatedAt || 0) - new Date(left.updatedAt || 0))
}

export default function ProgressTracker() {
  const [entries, setEntries] = useState(readProgressEntries)
  const completedCount = entries.reduce((sum, entry) => sum + entry.completed.length, 0)

  function clearAll() {
    entries.forEach((entry) => localStorage.removeItem(entry.key))
    setEntries([])
  }

  return (
    <div className="page inner-page progress-page">
      <div className="page-heading progress-page-heading"><div><span className="section-eyebrow"><span className="eyebrow-dot" /> YOUR JOURNEY</span><h1>Look how far you’ve come.</h1><p>Your checklists and small wins, saved right here in your browser.</p></div>{entries.length > 0 && <button className="subtle-button clear-all-button" onClick={clearAll}><Trash2 size={15} /> Clear all</button>}</div>
      <div className="stats-grid"><div className="stat-card"><span className="stat-label">ISSUES EXPLORED</span><strong>{entries.length.toString().padStart(2, '0')}</strong><span>Every one starts a story.</span></div><div className="stat-card stat-highlight"><span className="stat-label">STEPS COMPLETED</span><strong>{completedCount.toString().padStart(2, '0')}</strong><span>One check at a time.</span></div><div className="stat-card"><span className="stat-label">YOUR STREAK</span><strong>✦</strong><span>Keep showing up.</span></div></div>
      {entries.length === 0 ? <section className="panel empty-progress"><div className="empty-ghost"><svg viewBox="0 0 68 76" aria-hidden="true"><path d="M8 35a26 26 0 1 1 52 0v31l-9-6-9 7-8-7-9 7-8-7-9 6V35Z" fill="currentColor" /><circle cx="26" cy="34" r="3" fill="var(--accent-secondary)" /><circle cx="43" cy="34" r="3" fill="var(--accent-secondary)" /></svg></div><h2>Your journey starts with one step.</h2><p>Analyze an issue and tick off roadmap steps as you go. Your progress will show up here.</p><span className="empty-hinglish">Chhote chhote steps — that's how it starts.</span></section> :       <div className="progress-list">{entries.map((entry) => {
        const total = entry.totalSteps || Math.max(entry.completed.length, 1)
        const percent = total ? Math.min(100, Math.round((entry.completed.length / total) * 100)) : 0
        return <article className="progress-entry panel" key={entry.key}><div className="progress-entry-icon">{entry.completed.length ? <CheckCircle2 size={18} /> : <Circle size={18} />}</div><div className="progress-entry-main"><h3>{entry.issueTitle || 'Untitled issue'}</h3><div className="progress-entry-meta"><span>{entry.completed.length} of {total} steps completed</span><span className="meta-divider">·</span><span>{entry.updatedAt ? new Date(entry.updatedAt).toLocaleDateString() : 'Saved locally'}</span></div><div className="progress-track small-track"><div className="progress-fill" style={{ width: `${percent}%` }} /></div></div>{entry.issueUrl && <a className="entry-link" href={entry.issueUrl} target="_blank" rel="noreferrer" aria-label="Open related GitHub issue"><ArrowUpRight size={16} /></a>}</article>
      })}</div>}
      <div className="local-storage-note"><span className="privacy-lock">⌑</span> Your progress is saved only in this browser. Clear it any time.</div>
    </div>
  )
}
