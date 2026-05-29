import AddProductForm from '../components/AddProductForm'
import ProductTable from '../components/ProductTable'
import { useInventory } from '../context/InventoryContext'

function ProductsPage() {
  const { products, categories, warehouses, openProductModal, isProductModalOpen,
    productForm, setProductForm, productEditId, handleProductSave, deleteProduct,
    openPurchaseModal, isPurchaseModalOpen, purchaseProduct, purchaseQuantity,
    setPurchaseQuantity, handlePurchaseSubmit, handlePurchaseCancel,
    setIsProductModalOpen, hasPermission } = useInventory()

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Productos</h1>
        <p className="page-subtitle">Catálogo completo de productos tecnológicos</p>
        {hasPermission('manage_products') && (
          <div className="page-actions">
            <button className="btn btn-primary" onClick={() => openProductModal(null)}>+ Nuevo Producto</button>
          </div>
        )}
      </div>

      <ProductTable
        products={products}
        categories={categories}
        canManage={hasPermission('manage_products')}
        canPurchase={hasPermission('purchase_products')}
        onEdit={openProductModal}
        onDelete={deleteProduct}
        onPurchase={openPurchaseModal}
      />

      <AddProductForm
        isOpen={isProductModalOpen}
        title={productEditId ? `Editar: ${productForm.name}` : 'Nuevo Producto'}
        productForm={productForm}
        setProductForm={setProductForm}
        categories={categories}
        warehouses={warehouses}
        onSubmit={handleProductSave}
        onClose={() => setIsProductModalOpen(false)}
      />

      {isPurchaseModalOpen && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <h2 className="modal-title">Confirmar Compra</h2>
              <button className="modal-close" onClick={handlePurchaseCancel}>×</button>
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>Producto</div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>{purchaseProduct?.name}</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: 'var(--cyan)', marginTop: 4 }}>
                Stock disponible: {purchaseProduct?.quantity}
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label>Cantidad a comprar</label>
              <input type="number" min="1" max={purchaseProduct?.quantity}
                value={purchaseQuantity}
                onChange={e => setPurchaseQuantity(Number(e.target.value))} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={handlePurchaseCancel}>Cancelar</button>
              <button className="btn btn-primary" onClick={handlePurchaseSubmit}>Confirmar compra</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProductsPage
