import { ArrowUpRight, Sparkles } from 'lucide-react'
import AnalysisResults from '../components/AnalysisResults'
import IssueInput from '../components/IssueInput'
import LoadingState from '../components/LoadingState'

export default function Analyzer({ analysisState, onFetchIssue, onAnalyze, onToast }) {
  const { issueData, analysisData, loading, error, clearError } = analysisState
  return (
    <div className="page inner-page">
      <div className="page-heading"><span className="section-eyebrow"><span className="eyebrow-dot" /> ISSUE ANALYZER</span><h1>Find your first step.</h1><p>Paste a public GitHub issue or bring your own description. We’ll turn it into a learning plan you can own.</p></div>
      <IssueInput onFetchIssue={onFetchIssue} onAnalyze={onAnalyze} loading={loading} error={error} issueData={issueData} clearError={clearError} />
      {loading && <LoadingState />}
      {analysisData && <AnalysisResults issue={issueData} analysis={analysisData} onToast={onToast} />}
      {!loading && !analysisData && <section className="panel analyzer-hint"><div className="hint-icon"><Sparkles size={19} /></div><div><strong>Not sure where to begin?</strong><p>Try the sample issue to see how a real roadmap comes together.</p></div><span className="hint-arrow"><ArrowUpRight size={18} /></span></section>}
    </div>
  )
}
