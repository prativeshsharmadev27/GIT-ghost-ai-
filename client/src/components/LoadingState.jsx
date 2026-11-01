export default function LoadingState() {
  return (
    <section className="loading-panel" aria-live="polite" aria-label="Analyzing issue">
      <div className="loading-heading"><span className="skeleton skeleton-orb" /><div><span className="skeleton skeleton-line skeleton-title" /><span className="skeleton skeleton-line skeleton-short" /></div></div>
      <p className="loading-message">The ghost is reading the issue and mapping a path forward…</p>
      <div className="skeleton-grid">
        <div className="skeleton-card"><span className="skeleton skeleton-line skeleton-short" /><span className="skeleton skeleton-line" /><span className="skeleton skeleton-line" /></div>
        <div className="skeleton-card"><span className="skeleton skeleton-line skeleton-short" /><span className="skeleton skeleton-line" /><span className="skeleton skeleton-line" /></div>
        <div className="skeleton-card"><span className="skeleton skeleton-line skeleton-short" /><span className="skeleton skeleton-line" /><span className="skeleton skeleton-line" /></div>
      </div>
    </section>
  )
}
