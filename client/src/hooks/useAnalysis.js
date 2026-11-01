import { useCallback, useState } from 'react'
import { analyzeIssue as requestAnalysis, fetchIssue } from '../services/api'

function getSavedAnalysis() {
  try {
    return JSON.parse(localStorage.getItem('gitghost_last_analysis') || 'null')
  } catch {
    return null
  }
}

export default function useAnalysis() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [issueData, setIssueData] = useState(() => getSavedAnalysis()?.issue || null)
  const [analysisData, setAnalysisData] = useState(() => getSavedAnalysis()?.analysis || null)
  const clearError = useCallback(() => setError(null), [])

  async function fetchGitHubIssue(url) {
    setLoading(true)
    setError(null)
    try {
      const issue = await fetchIssue(url)
      setIssueData(issue)
      return issue
    } catch (requestError) {
      setError(requestError)
      throw requestError
    } finally {
      setLoading(false)
    }
  }

  async function analyzeIssue(data) {
    setLoading(true)
    setError(null)
    try {
      const analysis = await requestAnalysis(data)
      setIssueData({
        title: data.issueTitle,
        body: data.issueDescription,
        repository: data.repositoryContext || '',
        html_url: data.issueUrl || '',
        labels: [],
        state: '',
      })
      setAnalysisData(analysis)
      return analysis
    } catch (requestError) {
      setError(requestError)
      throw requestError
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    issueData,
    analysisData,
    fetchGitHubIssue,
    analyzeIssue,
    clearError,
  }
}
