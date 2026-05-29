function AddProductForm({ isOpen, title, productForm, setProductForm, categories, warehouses, onSubmit, onClose }) {
  if (!isOpen) return null
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form className="form" onSubmit={onSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Nombre *</label>
              <input placeholder="ej. MacBook Pro 16&quot; M3"
                value={productForm.name} onChange={e => setProductForm(p => ({ ...p, name: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>SKU *</label>
              <input placeholder="ej. MBP-M3-16" style={{ fontFamily: 'JetBrains Mono, monospace' }}
                value={productForm.sku} onChange={e => setProductForm(p => ({ ...p, sku: e.target.value.toUpperCase() }))} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Categoría *</label>
              <select value={productForm.categoryId} onChange={e => setProductForm(p => ({ ...p, categoryId: e.target.value }))} required>
                <option value="">Seleccionar...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Bodega *</label>
              <select value={productForm.warehouseId} onChange={e => setProductForm(p => ({ ...p, warehouseId: e.target.value }))} required>
                <option value="">Seleccionar...</option>
                {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Precio (COP) *</label>
              <input type="number" step="100" min="0" placeholder="0"
                value={productForm.price} onChange={e => setProductForm(p => ({ ...p, price: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>Cantidad *</label>
              <input type="number" min="0" placeholder="0"
                value={productForm.quantity} onChange={e => setProductForm(p => ({ ...p, quantity: e.target.value }))} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Stock Mínimo *</label>
              <input type="number" min="0" value={productForm.minStock} onChange={e => setProductForm(p => ({ ...p, minStock: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>Stock Máximo *</label>
              <input type="number" min="0" value={productForm.maxStock} onChange={e => setProductForm(p => ({ ...p, maxStock: e.target.value }))} required />
            </div>
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <textarea placeholder="Especificaciones técnicas del producto..."
              value={productForm.description} onChange={e => setProductForm(p => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Guardar Producto</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProductForm
