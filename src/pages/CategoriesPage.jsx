import { useInventory } from '../context/InventoryContext'

function CategoriesPage() {
  const { categories, products, openCategoryModal, isCategoryModalOpen, categoryForm,
    setCategoryForm, categoryEditId, handleCategorySave, deleteCategory,
    setIsCategoryModalOpen, hasPermission } = useInventory()

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Categorías</h1>
        <p className="page-subtitle">Organiza tu catálogo de productos tecnológicos</p>
        {hasPermission('manage_categories') && (
          <div className="page-actions">
            <button className="btn btn-primary" onClick={() => openCategoryModal(null)}>+ Nueva Categoría</button>
          </div>
        )}
      </div>

      <div className="grid grid-3">
        {categories.map(cat => {
          const count = products.filter(p => p.categoryId === cat.id).length
          const totalValue = products.filter(p => p.categoryId === cat.id).reduce((s, p) => s + p.price * p.quantity, 0)
          return (
            <div className="card" key={cat.id} style={{ borderTop: `3px solid ${cat.color}` }}>
              <div className="card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '0.5rem', background: `${cat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: cat.color, fontSize: '1.2rem' }}>◉</div>
                  <div>
                    <div className="card-title">{cat.name}</div>
                    <div className="card-subtitle">{count} producto{count !== 1 ? 's' : ''}</div>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <p style={{ fontSize: '0.85rem', color: 'var(--text2)', marginBottom: '0.75rem' }}>{cat.description}</p>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: cat.color }}>
                  Valor total: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(totalValue)}
                </div>
                {hasPermission('manage_categories') && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button className="btn btn-sm btn-secondary" style={{ flex: 1 }} onClick={() => openCategoryModal(cat)}>✏ Editar</button>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteCategory(cat)}>✕</button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {isCategoryModalOpen && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setIsCategoryModalOpen(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{categoryEditId ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
              <button className="modal-close" onClick={() => setIsCategoryModalOpen(false)}>×</button>
            </div>
            <form className="form" onSubmit={handleCategorySave}>
              <div className="form-group">
                <label>Nombre *</label>
                <input value={categoryForm.name} onChange={e => setCategoryForm(p => ({ ...p, name: e.target.value }))} required placeholder="ej. Laptops & PCs" />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea value={categoryForm.description} onChange={e => setCategoryForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe los productos de esta categoría..." />
              </div>
              <div className="form-group">
                <label>Color de identificación</label>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <input type="color" value={categoryForm.color} onChange={e => setCategoryForm(p => ({ ...p, color: e.target.value }))}
                    style={{ width: 48, height: 40, padding: '2px', cursor: 'pointer', borderRadius: '0.35rem', border: '1px solid var(--border)', background: 'var(--bg3)' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: 'var(--text2)' }}>{categoryForm.color}</span>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setIsCategoryModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar Categoría</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default CategoriesPage
