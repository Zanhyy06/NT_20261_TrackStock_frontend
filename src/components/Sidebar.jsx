import { NavLink } from 'react-router-dom'
import { useInventory } from '../context/InventoryContext'

const ICONS = {
  '/dashboard': '◈',
  '/products': '▣',
  '/categories': '◉',
  '/warehouses': '⬡',
  '/movements': '⇄',
  '/users': '⊞',
}

function Sidebar({ pages, isOpen, onToggle }) {
  const { hasPermission } = useInventory()
  const visiblePages = pages.filter(p => hasPermission(p.permission))

  return (
    <aside className={`sidebar ${isOpen ? 'active' : ''}`}>
      <div className="sidebar-logo">⚡ TechStock</div>
      <div className="sidebar-tagline">Inventory Management</div>
      <nav className="sidebar-nav">
        {visiblePages.map(page => (
          <NavLink
            key={page.path}
            to={page.path}
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            onClick={onToggle}
          >
            <span style={{ fontFamily: 'monospace', fontSize: '1rem', width: 20, textAlign: 'center', flexShrink: 0 }}>
              {ICONS[page.path] || '·'}
            </span>
            {page.label}
          </NavLink>
        ))}
      </nav>
      <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
        <div style={{ fontSize: '0.65rem', color: 'var(--text2)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          v2.0 · Tech Edition
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
