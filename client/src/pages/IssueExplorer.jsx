import { ArrowUpRight, Compass, Search, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { demoIssues } from '../data/demoIssue'

const categories = ['All issues', ...new Set(demoIssues.map((issue) => issue.category))]

export default function IssueExplorer({ onAnalyzeIssue }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All issues')

  const filteredIssues = useMemo(() => {
    const searchTerm = query.trim().toLowerCase()
    return demoIssues.filter((issue) => {
      const matchesCategory = category === 'All issues' || issue.category === category
      const searchableText = [
        issue.title,
        issue.body,
        issue.repository,
        issue.category,
        ...issue.labels,
      ].join(' ').toLowerCase()
      return matchesCategory && (!searchTerm || searchableText.includes(searchTerm))
    })
  }, [category, query])

  return (
    <div className="page inner-page explorer-page">
      <div className="page-heading explorer-heading">
        <span className="section-eyebrow"><span className="eyebrow-dot" /> THE ISSUE LIBRARY</span>
        <h1>Find an issue to explore.</h1>
        <p>Browse practice issues made for learning Git and open-source contribution basics. Pick one to load it into the analyzer.</p>
      </div>

      <section className="explorer-toolbar" aria-label="Filter sample issues">
        <label className="explorer-search">
          <Search size={17} />
          <input
            type="search"
            aria-label="Search sample issues"
            placeholder="Search issues, Git topics, or labels…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search">×</button>}
        </label>
        <div className="explorer-filter-row">
          <span className="filter-label">TOPICS</span>
          <div className="category-filters" role="group" aria-label="Filter by topic">
            {categories.map((item) => (
              <button
                type="button"
                key={item}
                className={`category-filter ${category === item ? 'category-filter-active' : ''}`}
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <span className="explorer-result-count">{filteredIssues.length} {filteredIssues.length === 1 ? 'issue' : 'issues'}</span>
        </div>
      </section>

      {filteredIssues.length ? (
        <div className="explorer-grid">
          {filteredIssues.map((issue) => (
            <article className="explorer-card panel" key={issue.id}>
              <div className="explorer-card-top">
                <span className="explorer-issue-number">DEMO · {String(demoIssues.indexOf(issue) + 1).padStart(2, '0')}</span>
                <span className={`demo-issue-category category-tone-${issue.id}`}>{issue.category}</span>
              </div>
              <h2>{issue.title}</h2>
              <p className="explorer-description">{issue.body}</p>
              <div className="explorer-repository"><Compass size={13} /><span>{issue.repository}</span></div>
              <div className="explorer-labels">{issue.labels.map((label) => <span className="explorer-label" key={label}>{label}</span>)}</div>
              <div className="explorer-card-footer">
                <span className="demo-only-note"><Sparkles size={12} /> Practice issue</span>
                <button type="button" className="button button-primary explorer-action" onClick={() => onAnalyzeIssue(issue)}>
                  Analyze issue <ArrowUpRight size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <section className="panel explorer-empty">
          <div className="empty-search-icon"><Search size={19} /></div>
          <h2>No matching issues</h2>
          <p>Try a different search or clear the topic filter to see all practice issues.</p>
          <button type="button" className="button button-secondary" onClick={() => { setQuery(''); setCategory('All issues') }}>Clear filters</button>
        </section>
      )}
      <p className="explorer-disclaimer">These are fictional practice prompts, not live issues from GitHub.</p>
    </div>
  )
}
