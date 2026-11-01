import { AlertTriangle, BookOpen, Lightbulb, Sparkles } from 'lucide-react'

export default function IssueAnalysis({ analysis }) {
  const difficultyClass = analysis.difficulty.toLowerCase()
  return (
    <div className="analysis-stack">
      <section className="panel analysis-hero-card">
        <div className="analysis-kicker"><span className="analysis-spark"><Sparkles size={15} /></span> THE GHOST'S READ</div>
        <h2>{analysis.summary}</h2>
        <p>{analysis.simpleExplanation}</p>
        <div className="difficulty-row"><span className={`difficulty-badge difficulty-${difficultyClass}`}>{analysis.difficulty}</span><span>{analysis.difficultyReason}</span></div>
        {analysis.technologies.length > 0 && <div className="chip-row">{analysis.technologies.map((technology) => <span className="tech-chip" key={technology}>{technology}</span>)}</div>}
      </section>

      <section className="panel">
        <div className="section-heading"><span className="heading-icon purple"><BookOpen size={17} /></span><div><h3>Concepts to learn</h3><p>A few ideas that will make this issue easier to tackle.</p></div></div>
        <div className="concept-grid">{analysis.conceptsToLearn.map((concept, index) => <article className="concept-card" key={`${concept.name}-${index}`}><span className="concept-number">{String(index + 1).padStart(2, '0')}</span><h4>{concept.name}</h4><p>{concept.explanation}</p></article>)}</div>
      </section>

      <section className="panel approach-card"><div className="section-heading"><span className="heading-icon cyan"><Lightbulb size={17} /></span><div><h3>Suggested approach</h3><p>Think of this as a map, not a script.</p></div></div><p className="approach-copy">{analysis.suggestedApproach}</p></section>

      {(analysis.assumptions.length > 0 || analysis.warnings.length > 0) && (
        <section className="panel notes-panel">
          {analysis.assumptions.length > 0 && <div className="notes-block"><h3>Assumptions to verify</h3><ul>{analysis.assumptions.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul></div>}
          {analysis.warnings.length > 0 && <div className="notes-block warning-notes"><h3><AlertTriangle size={15} /> Keep in mind</h3><ul>{analysis.warnings.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul></div>}
        </section>
      )}
    </div>
  )
}
