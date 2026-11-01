import { useCallback, useState } from 'react'
import Sidebar from './components/Sidebar'
import Toast from './components/Toast'
import Analyzer from './pages/Analyzer'
import Dashboard from './pages/Dashboard'
import LearningCenter from './pages/LearningCenter'
import ProgressTracker from './pages/ProgressTracker'
import useAnalysis from './hooks/useAnalysis'

const pageTitles = {
  dashboard: 'Your workspace',
  analyzer: 'Issue analyzer',
  learning: 'Git learning',
  progress: 'My progress',
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [toast, setToast] = useState({ message: '', type: 'success' })
  const analysisState = useAnalysis()
  const showToast = useCallback((message, type = 'success') => setToast({ message, type }), [])
  const dismissToast = useCallback(() => setToast({ message: '', type: 'success' }), [])

  async function handleAnalyze(data) {
    try {
      const analysis = await analysisState.analyzeIssue(data)
      const issue = {
        title: data.issueTitle,
        body: data.issueDescription,
        repository: data.repositoryContext || '',
        html_url: data.issueUrl || '',
        labels: [],
        state: '',
      }
      localStorage.setItem('gitghost_last_analysis', JSON.stringify({
        issue,
        analysis,
        analyzedAt: new Date().toISOString(),
      }))
    } catch {
      // The hook retains the actionable error for the input form.
    }
  }

  const sharedProps = {
    analysisState,
    onFetchIssue: analysisState.fetchGitHubIssue,
    onAnalyze: handleAnalyze,
    onToast: showToast,
  }

  return (
    <div className="app-shell">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="main-area">
        <header className="topbar"><div className="breadcrumb"><span>GITGHOST AI</span><span className="breadcrumb-separator">/</span><strong>{pageTitles[currentPage]}</strong></div><div className="topbar-status"><span className="status-dot" /> Your workspace, your pace</div></header>
        {currentPage === 'dashboard' && <Dashboard {...sharedProps} onNavigate={setCurrentPage} />}
        {currentPage === 'analyzer' && <Analyzer {...sharedProps} />}
        {currentPage === 'learning' && <LearningCenter />}
        {currentPage === 'progress' && <ProgressTracker />}
        <footer className="app-footer"><span>Made for curious contributors <span className="footer-heart">✦</span></span><span>GitGhost AI · Your code, your journey.</span></footer>
      </main>
      <Toast message={toast.message} type={toast.type} onDismiss={dismissToast} />
    </div>
  )
}
