import { Inventory } from '../inventory'

function ProductTable({ products, categories, onEdit, onDelete, onPurchase, canManage, canPurchase }) {
  const getCat = id => categories.find(c => c.id === id)
  const showActions = canManage || canPurchase

  return (
    <div className="card">
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>SKU</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              {showActions && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={showActions ? 7 : 6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text2)' }}>
                  No hay productos registrados
                </td>
              </tr>
            ) : products.map(p => {
              const cat = getCat(p.categoryId)
              const status = p.quantity > p.maxStock ? 'exceso' : p.quantity <= p.minStock ? 'bajo' : 'normal'
              const statusConfig = {
                normal: { cls: 'badge-success', label: '✓ Normal' },
                bajo: { cls: 'badge-danger', label: '⚠ Bajo' },
                exceso: { cls: 'badge-warning', label: '↑ Exceso' },
              }[status]

              return (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{p.name}</div>
                    {p.description && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--text2)', marginTop: 2, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.description}
                      </div>
                    )}
                  </td>
                  <td><span className="sku-code">{p.sku}</span></td>
                  <td>
                    {cat ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color, flexShrink: 0 }}></span>
                        {cat.name}
                      </span>
                    ) : 'N/A'}
                  </td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', fontWeight: 600, color: 'var(--cyan)' }}>
                    {Inventory.formatCurrency(p.price)}
                  </td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem' }}>
                    {p.quantity}
                  </td>
                  <td><span className={`badge ${statusConfig.cls}`}>{statusConfig.label}</span></td>
                  {showActions && (
                    <td>
                      <div className="table-actions">
                        {canPurchase && (
                          <button className="btn btn-sm btn-success" onClick={() => onPurchase(p)}>Comprar</button>
                        )}
                        {canManage && (
                          <>
                            <button className="btn btn-sm btn-secondary" onClick={() => onEdit(p)}>✏</button>
                            <button className="btn btn-sm btn-danger" onClick={() => onDelete(p)}>✕</button>
                          </>
                        )}
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
  )
}

export default ProductTable
