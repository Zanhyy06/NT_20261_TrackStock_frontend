function Topbar({ pageTitle, currentUser, darkMode, toggleDarkMode, onLogout, onToggleSidebar }) {
  const roleColors = {
    admin: '#22d3ee', gerente: '#a78bfa', almacenero: '#10b981',
    vendedor: '#f59e0b', cliente: '#94a3b8'
  }
  const roleColor = roleColors[currentUser?.role] || '#94a3b8'

  return (
    <div className="topbar">
      <div className="topbar-left">
        <button className="btn btn-ghost btn-sm" onClick={onToggleSidebar} style={{ padding: '0.45rem 0.6rem' }}>
          ☰
        </button>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1rem', lineHeight: 1.2 }}>{pageTitle}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: 2 }}>
            <span>{currentUser?.name}</span>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: roleColor, display: 'inline-block' }}></span>
            <span style={{ color: roleColor, fontWeight: 600, textTransform: 'capitalize', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem' }}>
              {currentUser?.role}
            </span>
          </div>
        </div>
      </div>
      <div className="topbar-right">
        <button className="btn btn-ghost btn-sm" onClick={toggleDarkMode} title="Cambiar tema">
          {darkMode ? '☀' : '◑'}
        </button>
        <button className="btn btn-danger btn-sm" onClick={onLogout}>
          Salir
        </button>
      </div>
    </div>
  )
}

export default Topbar
