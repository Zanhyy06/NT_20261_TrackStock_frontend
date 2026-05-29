import { useInventory } from '../context/InventoryContext'

const DEMO_USERS_INFO = [
  { role: 'Admin', email: 'admin@techstock.com', password: 'admin123' },
  { role: 'Gerente', email: 'gerente@techstock.com', password: 'gerente123' },
  { role: 'Almacenero', email: 'almacen@techstock.com', password: 'almacen123' },
  { role: 'Vendedor', email: 'vendedor@techstock.com', password: 'vendedor123' },
  { role: 'Cliente', email: 'cliente@techstock.com', password: 'cliente123' },
]

function LoginPage() {
  const { authTab, setAuthTab, loginValues, setLoginValues, registerValues, setRegisterValues, handleLogin, handleRegister } = useInventory()

  return (
    <div className="login-container">
      {/* LEFT PANEL */}
      <div className="login-left">
        <div className="login-logo">⚡ TechStock</div>
        <h1 className="login-title">
          Gestión de<br />
          <span style={{ color: 'var(--cyan)' }}>Inventario Tech</span>
        </h1>
        <p className="login-subtitle">
          Control total de productos tecnológicos: laptops, periféricos, componentes, redes y más. Con roles, movimientos y alertas en tiempo real.
        </p>
        <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {['🖥️  Laptops, PCs & Componentes', '🖱️  Periféricos & Accesorios', '🌐  Redes & Conectividad', '💾  Almacenamiento & Memorias'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text2)', fontSize: '0.875rem' }}>
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="login-right">
        <div className="login-form">
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid var(--border)', marginBottom: '1.75rem' }}>
            {[['login', 'Iniciar Sesión'], ['register', 'Registrarse']].map(([tab, label]) => (
              <button key={tab} type="button"
                style={{
                  flex: 1, padding: '0.65rem', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  fontSize: '0.875rem', fontWeight: 600, color: authTab === tab ? 'var(--cyan)' : 'var(--text2)',
                  borderBottom: authTab === tab ? '2px solid var(--cyan)' : '2px solid transparent',
                  marginBottom: '-1px', transition: 'color 0.2s'
                }}
                onClick={() => setAuthTab(tab)}
              >{label}</button>
            ))}
          </div>

          {authTab === 'login' ? (
            <form className="form" onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="usuario@techstock.com"
                  value={loginValues.email}
                  onChange={e => setLoginValues(p => ({ ...p, email: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Contraseña</label>
                <input type="password" placeholder="••••••••"
                  value={loginValues.password}
                  onChange={e => setLoginValues(p => ({ ...p, password: e.target.value }))} required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                Iniciar sesión →
              </button>
            </form>
          ) : (
            <form className="form" onSubmit={handleRegister}>
              <div className="form-group">
                <label>Nombre completo</label>
                <input type="text" value={registerValues.name}
                  onChange={e => setRegisterValues(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={registerValues.email}
                  onChange={e => setRegisterValues(p => ({ ...p, email: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Contraseña</label>
                <input type="password" value={registerValues.password}
                  onChange={e => setRegisterValues(p => ({ ...p, password: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Rol</label>
                <select value={registerValues.role} onChange={e => setRegisterValues(p => ({ ...p, role: e.target.value }))}>
                  <option value="cliente">Cliente</option>
                  <option value="vendedor">Vendedor</option>
                  <option value="almacenero">Almacenero</option>
                  <option value="gerente">Gerente</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                Crear cuenta →
              </button>
            </form>
          )}

          <div className="demo-users">
            <p style={{ fontWeight: 600, marginBottom: '0.6rem', fontSize: '0.78rem', color: 'var(--text2)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Cuentas de demo
            </p>
            {DEMO_USERS_INFO.map(u => (
              <div key={u.email} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--text2)', width: 80 }}>{u.role}</span>
                <code>{u.email}</code>
                <code>{u.password}</code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
