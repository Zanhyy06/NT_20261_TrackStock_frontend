import { Inventory } from '../inventory'
import { useInventory } from '../context/InventoryContext'

function StatCard({ icon, label, value, accent = 'var(--cyan)' }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: `${accent}18`, color: accent }}>
        {icon}
      </div>
      <div className="stat-content">
        <div className="stat-label">{label}</div>
        <div className="stat-value" style={{ color: accent }}>{value}</div>
      </div>
    </div>
  )
}

function Dashboard() {
  const { products, warehouses, movements, categories } = useInventory()
  const totalValue = products.reduce((s, p) => s + p.price * p.quantity, 0)
  const lowStock = products.filter(p => p.quantity <= p.minStock)
  const overStock = products.filter(p => p.quantity > p.maxStock)
  const recent = [...movements].slice(-5).reverse()

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Resumen en tiempo real del inventario de tecnología</p>
      </div>

      <div className="grid grid-4" style={{ marginBottom: '1.25rem' }}>
        <StatCard icon="▣" label="Productos" value={products.length} />
        <StatCard icon="💰" label="Valor Inventario" value={Inventory.formatCurrency(totalValue)} accent="#10b981" />
        <StatCard icon="⚠" label="Stock Bajo" value={lowStock.length} accent={lowStock.length > 0 ? '#ef4444' : '#10b981'} />
        <StatCard icon="⬡" label="Bodegas" value={warehouses.length} accent="#a78bfa" />
      </div>

      <div className="grid grid-2">
        {/* Recent movements */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Últimos Movimientos</div>
              <div className="card-subtitle">Entradas y salidas recientes</div>
            </div>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Tipo</th>
                  <th>Cant.</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {recent.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text2)', padding: '2rem' }}>Sin movimientos registrados</td></tr>
                ) : recent.map(m => {
                  const product = Inventory.getProductById(m.productId)
                  return (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 500 }}>{product?.name || 'N/A'}</td>
                      <td>
                        <span className={`badge ${m.type === 'entrada' ? 'badge-success' : 'badge-warning'}`}>
                          {m.type === 'entrada' ? '↑ Entrada' : '↓ Salida'}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem' }}>{m.quantity}</td>
                      <td style={{ color: 'var(--text2)', fontSize: '0.78rem' }}>{Inventory.formatDate(m.createdAt)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low stock */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Alertas de Stock</div>
              <div className="card-subtitle">Productos que requieren reposición</div>
            </div>
            {lowStock.length > 0 && (
              <span className="badge badge-danger">{lowStock.length} alerta{lowStock.length !== 1 ? 's' : ''}</span>
            )}
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Stock</th>
                  <th>Mínimo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text2)', padding: '2rem' }}>✓ Todo el stock en niveles normales</td></tr>
                ) : lowStock.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 500, fontSize: '0.82rem' }}>{p.name}</td>
                    <td>
                      <span className="sku-code">{p.quantity}</span>
                    </td>
                    <td style={{ color: 'var(--text2)', fontSize: '0.82rem' }}>{p.minStock}</td>
                    <td><span className="badge badge-danger">⚠ Bajo</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Category summary */}
      <div className="grid grid-3" style={{ marginTop: '1.25rem' }}>
        {categories.map(cat => {
          const count = products.filter(p => p.categoryId === cat.id).length
          const value = products.filter(p => p.categoryId === cat.id).reduce((s, p) => s + p.price * p.quantity, 0)
          return (
            <div className="stat-card" key={cat.id}>
              <div className="stat-icon" style={{ background: `${cat.color}18`, color: cat.color, fontSize: '1rem' }}>◉</div>
              <div className="stat-content">
                <div className="stat-label" style={{ textTransform: 'none', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)' }}>{cat.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text2)' }}>{count} productos</div>
                <div style={{ fontSize: '0.78rem', color: cat.color, fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>{Inventory.formatCurrency(value)}</div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default Dashboard
