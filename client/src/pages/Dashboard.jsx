import { ArrowDown, ArrowUpRight, BookOpen, GitBranch, GitPullRequest, Sparkles, Target } from 'lucide-react'
import AnalysisResults from '../components/AnalysisResults'
import IssueInput from '../components/IssueInput'
import LoadingState from '../components/LoadingState'

const features = [
  { icon: BookOpen, title: 'Understand the issue', copy: 'Turn intimidating issue text into plain-language context.', tone: 'purple' },
  { icon: Target, title: 'Plan your fix', copy: 'Break the work into small steps you can actually finish.', tone: 'cyan' },
  { icon: GitBranch, title: 'Learn Git as you go', copy: 'Get the commands and concepts you need, right on time.', tone: 'green' },
  { icon: GitPullRequest, title: 'Prepare your PR', copy: 'Shape your solution into a thoughtful review-ready draft.', tone: 'orange' },
]

export default function Dashboard({ analysisState, onFetchIssue, onAnalyze, onNavigate, onToast }) {
  const { issueData, analysisData, loading, error, clearError } = analysisState
  const savedAt = (() => {
    try { return JSON.parse(localStorage.getItem('gitghost_last_analysis') || 'null')?.analyzedAt } catch { return null }
  })()

  return (
    <div className="page dashboard-page">
      <section className="welcome-strip"><span className="welcome-spark"><Sparkles size={14} /></span><span>Your friendly guide to a first contribution</span><span className="strip-divider" /><span className="strip-muted">No experience required</span></section>
      <div className="hero-layout">
        <div className="hero-copy"><span className="section-eyebrow"><span className="eyebrow-dot" /> YOUR OPEN-SOURCE SIDEKICK</span><h1>Make your first<br />contribution feel <span className="hero-highlight">possible.</span></h1><p>Open-source issues can feel like a different language. GitGhost helps you understand the ask, find a place to start, and learn while you build.</p><button className="hero-cta" onClick={() => document.getElementById('issue-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>Find your way in <ArrowDown size={16} /></button><div className="hero-trust"><div className="avatar-stack"><span>G</span><span>✦</span><span>+</span></div><span>Built for curious contributors</span></div></div>
        <div className="hero-art" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="hero-star star-one">✦</div><div className="hero-star star-two">✧</div><div className="floating-label label-issue"><span className="mini-label-icon"><GitBranch size={13} /></span>your first issue</div><div className="ghost-illustration"><svg viewBox="0 0 170 190"><defs><linearGradient id="ghostGradient" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#b9a2ff" /><stop offset="1" stopColor="#7955e8" /></linearGradient></defs><path d="M25 92a60 60 0 1 1 120 0v67l-21-13-19 15-20-15-20 15-19-15-21 13V92Z" fill="url(#ghostGradient)" /><ellipse cx="67" cy="87" rx="7" ry="10" fill="#22D3EE" /><ellipse cx="105" cy="87" rx="7" ry="10" fill="#22D3EE" /><path d="M78 109q8 8 16 0" fill="none" stroke="#38256e" strokeWidth="4" strokeLinecap="round" /><path d="M40 43q10-14 23-19" fill="none" stroke="#fff" strokeWidth="4" opacity=".3" strokeLinecap="round" /></svg></div><div className="floating-label label-ready"><span className="ready-check">✓</span>you’ve got this!</div><span className="hero-glow" /></div>
      </div>

      <div className="feature-grid">{features.map(({ icon: Icon, title, copy, tone }, index) => <article className="feature-card" key={title}><div className={`feature-icon ${tone}`}><Icon size={18} /></div><span className="feature-index">0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>

      <section className="workbench" id="issue-form"><div className="workbench-heading"><div><span className="section-eyebrow"><span className="eyebrow-dot" /> THE ISSUE WORKBENCH</span><h2>Start with the issue.</h2></div><button className="quiet-link" onClick={() => onNavigate('learning')}>New to Git? Start here <ArrowUpRight size={15} /></button></div><IssueInput onFetchIssue={onFetchIssue} onAnalyze={onAnalyze} loading={loading} error={error} issueData={issueData} clearError={clearError} /></section>
      {loading && <LoadingState />}
      {analysisData && <AnalysisResults issue={issueData} analysis={analysisData} onToast={onToast} />}
      {!analysisData && !loading && <div className="first-run-note"><div className="note-icon"><Sparkles size={17} /></div><div><strong>Start small. Make it yours.</strong><p>Pick an issue that interests you. GitGhost will help you find the first step, not do the work for you.</p></div></div>}
      {savedAt && analysisData && <div className="save-caption">Last analysis saved {new Date(savedAt).toLocaleString()} on this device.</div>}
    </div>
  )
}
