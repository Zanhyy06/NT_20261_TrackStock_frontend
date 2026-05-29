import { Inventory } from '../inventory'
import { useInventory } from '../context/InventoryContext'

function MovementsPage() {
  const { products, warehouses, movements, openMovementModal, isMovementModalOpen,
    movementForm, setMovementForm, handleMovementSave, hasPermission, setIsMovementModalOpen } = useInventory()

  const entries = movements.filter(m => m.type === 'entrada').length
  const exits = movements.filter(m => m.type === 'salida').length

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Movimientos</h1>
        <p className="page-subtitle">Historial de entradas y salidas de inventario</p>
        {hasPermission('manage_movements') && (
          <div className="page-actions">
            <button className="btn btn-primary" onClick={openMovementModal}>+ Nuevo Movimiento</button>
          </div>
        )}
      </div>

      <div className="grid grid-3" style={{ marginBottom: '1.25rem' }}>
        {[
          { label: 'Entradas', value: entries, accent: '#10b981' },
          { label: 'Salidas', value: exits, accent: '#f59e0b' },
          { label: 'Total', value: movements.length, accent: 'var(--cyan)' },
        ].map(({ label, value, accent }) => (
          <div className="stat-card" key={label}>
            <div className="stat-icon" style={{ background: `${accent}18`, color: accent }}>⇄</div>
            <div className="stat-content">
              <div className="stat-label">{label}</div>
              <div className="stat-value" style={{ color: accent }}>{value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Tipo</th>
                <th>Bodega</th>
                <th>Cant.</th>
                <th>Descripción</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {movements.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text2)', padding: '3rem' }}>No hay movimientos registrados</td></tr>
              ) : [...movements].reverse().map(m => {
                const product = Inventory.getProductById(m.productId)
                const warehouse = warehouses.find(w => w.id === m.warehouseId)
                return (
                  <tr key={m.id}>
                    <td style={{ fontWeight: 600, fontSize: '0.85rem' }}>{product?.name || 'N/A'}</td>
                    <td>
                      <span className={`badge ${m.type === 'entrada' ? 'badge-success' : 'badge-warning'}`}>
                        {m.type === 'entrada' ? '↑ Entrada' : '↓ Salida'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text2)' }}>{warehouse?.name || 'N/A'}</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem' }}>{m.quantity}</td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text2)', maxWidth: 200 }}>{m.description || '—'}</td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text2)', whiteSpace: 'nowrap' }}>
                      {Inventory.formatDate(m.createdAt)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isMovementModalOpen && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setIsMovementModalOpen(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Nuevo Movimiento</h2>
              <button className="modal-close" onClick={() => setIsMovementModalOpen(false)}>×</button>
            </div>
            <form className="form" onSubmit={handleMovementSave}>
              <div className="form-group">
                <label>Tipo *</label>
                <select value={movementForm.type} onChange={e => setMovementForm(p => ({ ...p, type: e.target.value }))} required>
                  <option value="">Seleccionar tipo...</option>
                  <option value="entrada">↑ Entrada de inventario</option>
                  <option value="salida">↓ Salida de inventario</option>
                </select>
              </div>
              <div className="form-group">
                <label>Producto *</label>
                <select value={movementForm.productId} onChange={e => setMovementForm(p => ({ ...p, productId: e.target.value }))} required>
                  <option value="">Seleccionar producto...</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name} — Stock: {p.quantity}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Bodega *</label>
                <select value={movementForm.warehouseId} onChange={e => setMovementForm(p => ({ ...p, warehouseId: e.target.value }))} required>
                  <option value="">Seleccionar bodega...</option>
                  {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Cantidad *</label>
                <input type="number" min="1" value={movementForm.quantity} onChange={e => setMovementForm(p => ({ ...p, quantity: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Descripción / Referencia</label>
                <textarea placeholder="ej. Compra a proveedor Samsung Q2 2025" value={movementForm.description} onChange={e => setMovementForm(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setIsMovementModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Registrar Movimiento</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default MovementsPage
