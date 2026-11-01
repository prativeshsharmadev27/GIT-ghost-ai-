import { BookOpen, ChartNoAxesColumnIncreasing, GitBranch, LayoutDashboard, Menu, X } from 'lucide-react'
import { useState } from 'react'

const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'analyzer', label: 'Analyze Issue', icon: GitBranch },
  { id: 'learning', label: 'Git Learning', icon: BookOpen },
  { id: 'progress', label: 'My Progress', icon: ChartNoAxesColumnIncreasing },
]

function GhostMark() {
  return (
    <svg viewBox="0 0 48 48" className="ghost-mark" role="img" aria-label="GitGhost">
      <path d="M8 22a16 16 0 1 1 32 0v17l-6-4-5 4-5-4-5 4-5-4-6 4V22Z" fill="currentColor" />
      <circle cx="19" cy="22" r="2.2" fill="var(--accent-secondary)" />
      <circle cx="29" cy="22" r="2.2" fill="var(--accent-secondary)" />
    </svg>
  )
}

export default function Sidebar({ currentPage, onNavigate }) {
  const [open, setOpen] = useState(false)

  function navigate(page) {
    onNavigate(page)
    setOpen(false)
  }

  return (
    <>
      <button className="mobile-menu-button icon-button" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'}>
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      {open && <button className="sidebar-backdrop" onClick={() => setOpen(false)} aria-label="Close navigation" />}
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-icon"><GhostMark /></div>
          <div className="brand-copy"><strong>GitGhost <span>AI</span></strong><small>Spooky smart contributions</small></div>
        </div>
        <div className="sidebar-label">WORKSPACE</div>
        <nav className="nav-list" aria-label="Main navigation">
          {navigation.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => navigate(id)} className={`nav-item ${currentPage === id ? 'nav-item-active' : ''}`}>
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
              {currentPage === id && <span className="nav-active-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-promo">
            <span className="promo-icon">✦</span>
            <strong>Good first issues</strong>
            <p>Every great contribution starts with one small step.</p>
            <button onClick={() => navigate('analyzer')}>Find your next step <span>↗</span></button>
          </div>
          <div className="sidebar-footer"><span className="status-dot" /> Ready to contribute</div>
        </div>
      </aside>
    </>
  )
}
