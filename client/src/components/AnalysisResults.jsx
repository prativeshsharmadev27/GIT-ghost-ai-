import { useState } from 'react'
import { BookOpen, CheckSquare, GitBranch, Sparkles } from 'lucide-react'
import GitCommands from './GitCommands'
import IssueAnalysis from './IssueAnalysis'
import PRAssistant from './PRAssistant'
import Roadmap from './Roadmap'
import MentorChat from './MentorChat'

const tabs = [
  { id: 'overview', label: 'Overview', icon: Sparkles },
  { id: 'roadmap', label: 'Roadmap', icon: CheckSquare },
  { id: 'git', label: 'Git toolkit', icon: GitBranch },
  { id: 'pr', label: 'PR draft', icon: BookOpen },
]

export default function AnalysisResults({ issue, analysis, onToast }) {
  const [activeTab, setActiveTab] = useState('overview')
  if (!analysis) return null

  return (
    <section className="results-section">
      <div className="results-heading"><div><span className="section-eyebrow"><span className="eyebrow-dot" /> YOUR CONTRIBUTION PLAN</span><h2>Here’s your way in.</h2></div><span className="results-live"><span className="status-dot" /> Saved in this browser</span></div>
      <div className="results-workspace">
        <div className="results-main">
          <div className="results-tabs" role="tablist" aria-label="Analysis sections">{tabs.map(({ id, label, icon: Icon }) => <button key={id} role="tab" aria-selected={activeTab === id} className={activeTab === id ? 'results-tab active' : 'results-tab'} onClick={() => setActiveTab(id)}><Icon size={16} />{label}{id === 'roadmap' && <span className="tab-count">{analysis.roadmap.length}</span>}</button>)}</div>
          <div className="results-content">
            {activeTab === 'overview' && <IssueAnalysis analysis={analysis} />}
            {activeTab === 'roadmap' && <Roadmap key={issue?.html_url || issue?.title || ''} issue={issue} steps={analysis.roadmap} />}
            {activeTab === 'git' && <GitCommands commands={analysis.gitCommands} onToast={onToast} />}
            {activeTab === 'pr' && <PRAssistant draft={analysis.prDraft} onToast={onToast} />}
          </div>
        </div>
        <MentorChat
          key={`${issue?.html_url || issue?.title || 'issue'}:${analysis.summary}`}
          issue={issue}
          analysis={analysis}
        />
      </div>
    </section>
  )
}
