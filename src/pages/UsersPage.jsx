import { Inventory } from '../inventory'
import { useInventory } from '../context/InventoryContext'

const ROLE_COLORS = {
  admin: '#22d3ee', gerente: '#a78bfa', almacenero: '#10b981',
  vendedor: '#f59e0b', cliente: '#94a3b8'
}

function UsersPage() {
  const { users, currentUser, openUserModal, isUserModalOpen, userForm,
    setUserForm, userEditId, handleUserSave, deleteUser, hasPermission, setIsUserModalOpen } = useInventory()

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Usuarios</h1>
        <p className="page-subtitle">Administración de accesos y roles del sistema</p>
        {hasPermission('manage_users') && (
          <div className="page-actions">
            <button className="btn btn-primary" onClick={() => openUserModal(null)}>+ Nuevo Usuario</button>
          </div>
        )}
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Registro</th>
                {hasPermission('manage_users') && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {users.map(u => {
                const roleColor = ROLE_COLORS[u.role] || '#94a3b8'
                const isMe = currentUser?.id === u.id
                return (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${roleColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: roleColor, fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{u.name}</div>
                          {isMe && <div style={{ fontSize: '0.65rem', color: 'var(--cyan)' }}>Tú</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: 'var(--text2)' }}>{u.email}</td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.6rem', borderRadius: 9999, background: `${roleColor}18`, color: roleColor, fontSize: '0.72rem', fontWeight: 600, textTransform: 'capitalize', border: `1px solid ${roleColor}30` }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text2)' }}>{u.createdAt ? Inventory.formatDate(u.createdAt) : '—'}</td>
                    {hasPermission('manage_users') && (
                      <td>
                        <div className="table-actions">
                          <button className="btn btn-sm btn-secondary" onClick={() => openUserModal(u)}>✏</button>
                          <button className="btn btn-sm btn-danger" onClick={() => deleteUser(u)} disabled={isMe} title={isMe ? 'No puedes eliminar tu propia cuenta' : ''}>✕</button>
                        </div>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isUserModalOpen && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setIsUserModalOpen(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{userEditId ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
              <button className="modal-close" onClick={() => setIsUserModalOpen(false)}>×</button>
            </div>
            <form className="form" onSubmit={handleUserSave}>
              <div className="form-group">
                <label>Nombre completo *</label>
                <input value={userForm.name} onChange={e => setUserForm(p => ({ ...p, name: e.target.value }))} required placeholder="ej. María García" />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" value={userForm.email} onChange={e => setUserForm(p => ({ ...p, email: e.target.value }))} required placeholder="usuario@techstock.com" />
              </div>
              <div className="form-group">
                <label>Contraseña *</label>
                <input type="password" value={userForm.password} onChange={e => setUserForm(p => ({ ...p, password: e.target.value }))} required placeholder="Mínimo 6 caracteres" />
              </div>
              <div className="form-group">
                <label>Rol *</label>
                <select value={userForm.role} onChange={e => setUserForm(p => ({ ...p, role: e.target.value }))} required>
                  <option value="admin">Administrador</option>
                  <option value="gerente">Gerente</option>
                  <option value="almacenero">Almacenero</option>
                  <option value="vendedor">Vendedor</option>
                  <option value="cliente">Cliente</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setIsUserModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar Usuario</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default UsersPage
