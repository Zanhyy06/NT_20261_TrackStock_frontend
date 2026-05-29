import { useInventory } from '../context/InventoryContext'

function WarehousesPage() {
  const { warehouses, products, openWarehouseModal, isWarehouseModalOpen,
    warehouseForm, setWarehouseForm, warehouseEditId, handleWarehouseSave,
    deleteWarehouse, setIsWarehouseModalOpen, hasPermission } = useInventory()

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Bodegas</h1>
        <p className="page-subtitle">Gestión de ubicaciones y capacidad de almacenamiento</p>
        {hasPermission('manage_warehouses') && (
          <div className="page-actions">
            <button className="btn btn-primary" onClick={() => openWarehouseModal(null)}>+ Nueva Bodega</button>
          </div>
        )}
      </div>

      <div className="grid grid-2">
        {warehouses.map(w => {
          const warehouseProducts = products.filter(p => p.warehouseId === w.id)
          const usedCapacity = warehouseProducts.reduce((s, p) => s + p.quantity, 0)
          const pct = w.capacity > 0 ? Math.min(Math.round((usedCapacity / w.capacity) * 100), 100) : 0
          const barColor = pct > 90 ? '#ef4444' : pct > 70 ? '#f59e0b' : '#10b981'

          return (
            <div className="card" key={w.id}>
              <div className="card-header">
                <div>
                  <div className="card-title">{w.name}</div>
                  <div className="card-subtitle" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: 2 }}>
                    <span>📍</span> {w.location}
                  </div>
                </div>
                <span className="badge badge-primary" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{warehouseProducts.length} SKUs</span>
              </div>
              <div className="card-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  {[
                    ['Capacidad', `${w.capacity.toLocaleString()} u.`],
                    ['Ocupado', `${usedCapacity.toLocaleString()} u.`],
                    ['Disponible', `${(w.capacity - usedCapacity).toLocaleString()} u.`],
                    ['Productos', warehouseProducts.length],
                  ].map(([label, val]) => (
                    <div key={label} style={{ background: 'var(--bg3)', borderRadius: '0.45rem', padding: '0.6rem 0.75rem' }}>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text2)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 2 }}>{label}</div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>{val}</div>
                    </div>
                  ))}
                </div>
                {/* Progress bar */}
                <div style={{ marginBottom: '0.4rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text2)' }}>
                  <span>Ocupación</span>
                  <span style={{ color: barColor, fontWeight: 600 }}>{pct}%</span>
                </div>
                <div style={{ height: 8, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: barColor, borderRadius: 4, transition: 'width 0.4s' }} />
                </div>
                {hasPermission('manage_warehouses') && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button className="btn btn-sm btn-secondary" style={{ flex: 1 }} onClick={() => openWarehouseModal(w)}>✏ Editar</button>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteWarehouse(w)}>✕</button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {isWarehouseModalOpen && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setIsWarehouseModalOpen(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{warehouseEditId ? 'Editar Bodega' : 'Nueva Bodega'}</h2>
              <button className="modal-close" onClick={() => setIsWarehouseModalOpen(false)}>×</button>
            </div>
            <form className="form" onSubmit={handleWarehouseSave}>
              <div className="form-group">
                <label>Nombre *</label>
                <input placeholder="ej. HQ TechStock Bogotá" value={warehouseForm.name} onChange={e => setWarehouseForm(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Ubicación *</label>
                <input placeholder="ej. Bogotá D.C." value={warehouseForm.location} onChange={e => setWarehouseForm(p => ({ ...p, location: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Capacidad (unidades) *</label>
                <input type="number" min="1" value={warehouseForm.capacity} onChange={e => setWarehouseForm(p => ({ ...p, capacity: e.target.value }))} required />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setIsWarehouseModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar Bodega</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default WarehousesPage
