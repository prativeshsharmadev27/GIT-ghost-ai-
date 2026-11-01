import { Check, Copy, FileCode2 } from 'lucide-react'
import { useState } from 'react'

function formatPullRequest(prDraft) {
  return `## Summary\n${prDraft.summary}\n\n## Proposed changes\n${prDraft.proposedChanges.map((item) => `- ${item}`).join('\n')}\n\n## Testing\n${prDraft.testingChecklist.map((item) => `- [ ] ${item}`).join('\n')}\n\n## Related issue\n${prDraft.relatedIssue}`
}

export default function PRAssistant({ draft, onToast }) {
  const [copied, setCopied] = useState('')

  async function copyText(text, label) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(label)
      onToast(label === 'title' ? 'Title copied!' : 'PR draft copied!')
      window.setTimeout(() => setCopied(''), 2000)
    } catch {
      onToast('Clipboard access was blocked by your browser.', 'error')
    }
  }

  return (
    <section className="panel pr-panel">
      <div className="pr-topline"><div className="section-heading"><span className="heading-icon cyan"><FileCode2 size={17} /></span><div><h3>PR draft assistant</h3><p>A first draft to customize after your work is done.</p></div></div><div className="pr-actions"><button className="button button-secondary compact-button" onClick={() => copyText(draft.title, 'title')}>{copied === 'title' ? <Check size={15} /> : <Copy size={15} />}Copy title</button><button className="button button-primary compact-button" onClick={() => copyText(`## ${draft.title}\n\n${formatPullRequest(draft)}`, 'draft')}>{copied === 'draft' ? <Check size={15} /> : <Copy size={15} />}Copy full draft</button></div></div>
      <div className="markdown-preview"><div className="markdown-toolbar"><span className="markdown-dot" /><span className="markdown-dot" /><span className="markdown-dot" /><span className="markdown-label">MARKDOWN PREVIEW</span></div><div className="markdown-body"><h2>{draft.title}</h2><h3>Summary</h3><p>{draft.summary}</p><h3>Proposed changes</h3><ul>{draft.proposedChanges.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul><h3>Testing</h3><ul className="checklist-preview">{draft.testingChecklist.map((item, index) => <li key={`${item}-${index}`}><span className="empty-checkbox" />{item}</li>)}</ul><h3>Related issue</h3><p>{draft.relatedIssue}</p></div></div>
      <div className="disclaimer"><span>ⓘ</span> This is a proposed draft. Actual implementation and testing must be done by you.</div>
    </section>
  )
}
