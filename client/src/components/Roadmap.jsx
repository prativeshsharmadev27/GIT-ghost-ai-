import { Check, ChevronDown, RotateCcw } from 'lucide-react'
import { useState } from 'react'

function hashIssue(value) {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0).toString(36)
}

function getProgress(storageKey) {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || '{"completed":[]}')
  } catch {
    return { completed: [] }
  }
}

function createProgress(issue, completed, totalSteps) {
  return {
    issueTitle: issue?.title || 'Untitled issue',
    issueUrl: issue?.html_url || '',
    completed,
    totalSteps,
    updatedAt: new Date().toISOString(),
  }
}

export default function Roadmap({ issue, steps }) {
  const issueIdentity = issue?.html_url || `${issue?.repository || ''}:${issue?.title || 'issue'}`
  const storageKey = `gitghost_progress_${hashIssue(issueIdentity)}`
  const [progress, setProgress] = useState(() => getProgress(storageKey))
  const [expanded, setExpanded] = useState(null)
  const completed = new Set(progress.completed || [])
  const total = steps.length
  const percent = total ? Math.round((completed.size / total) * 100) : 0

  function toggleStep(id) {
    const next = new Set(completed)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    const nextProgress = createProgress(issue, [...next], total)
    setProgress(nextProgress)
    localStorage.setItem(storageKey, JSON.stringify(nextProgress))
  }

  function resetProgress() {
    const next = createProgress(issue, [], total)
    setProgress(next)
    localStorage.setItem(storageKey, JSON.stringify(next))
  }

  return (
    <section className="panel roadmap-panel">
      <div className="section-heading roadmap-heading"><span className="heading-icon purple">✦</span><div><h3>Your contribution roadmap</h3><p>One small step at a time. You've got this.</p></div><button className="subtle-button reset-button" onClick={resetProgress}><RotateCcw size={14} /> Reset</button></div>
      <div className="progress-overview"><div className="progress-label"><span><strong>{completed.size}</strong> of {total} steps complete</span><span>{percent}%</span></div><div className="progress-track"><div className="progress-fill" style={{ width: `${percent}%` }} /></div></div>
      <div className="roadmap-list">{steps.map((step, index) => {
        const isCompleted = completed.has(step.id)
        const isExpanded = expanded === step.id
        const categoryClass = String(step.category || 'Setup').toLowerCase().replace(/[^a-z]+/g, '-')
        return (
          <article className={`roadmap-step ${isCompleted ? 'roadmap-step-done' : ''}`} key={step.id}>
            <button className={`step-check ${isCompleted ? 'checked' : ''}`} aria-label={`${isCompleted ? 'Mark incomplete' : 'Mark complete'}: ${step.title}`} onClick={() => toggleStep(step.id)}>{isCompleted && <Check size={14} />}</button>
            <div className="step-content"><div className="step-title-row"><span className="step-index">{String(index + 1).padStart(2, '0')}</span><button className="step-title-button" onClick={() => setExpanded(isExpanded ? null : step.id)} aria-expanded={isExpanded}>{step.title}</button><span className={`category-tag category-${categoryClass}`}>{step.category}</span><button className="expand-button" aria-label={isExpanded ? 'Collapse details' : 'Expand details'} onClick={() => setExpanded(isExpanded ? null : step.id)}><ChevronDown size={16} className={isExpanded ? 'chevron-open' : ''} /></button></div>{isExpanded && <p className="step-description">{step.description}</p>}</div>
          </article>
        )
      })}</div>
      <p className="roadmap-footnote">Your checklist saves automatically in this browser.</p>
    </section>
  )
}
