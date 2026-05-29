const BASE = 'http://localhost:8080/producto'

async function safeFetch(url, options) {
  const res = await fetch(url, options)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`HTTP ${res.status}: ${text}`)
  }
  return res.json()
}

export async function getProducts() {
  const data = await safeFetch(BASE)
  if (!Array.isArray(data)) return []
  const timestamp = Date.now()
  return data.map((p, idx) => {
    // Asegurar que siempre hay un ID válido (no undefined ni null)
    const id = p.idProductos ?? p.id ?? `prod_${timestamp}_${idx}`
    return {
      id: id,
      name: p.nombre ?? p.name ?? 'N/A',
      sku: p.sku ?? '',
      categoryId: p.idCategoria ?? p.categoriaId ?? null,
      warehouseId: p.idAlmacen ?? p.almacenId ?? null,
      price: Number(p.precioActual ?? p.precioCompra ?? p.costoUnitario ?? 0) || 0,
      quantity: Number(p.stockActual ?? p.cantidad ?? 0) || 0,
      minStock: Number(p.stockMinimo ?? p.stockMin ?? 0) || 0,
      maxStock: Number(p.stockMaximo ?? p.stockMax ?? 0) || 0,
      description: p.descripcion ?? (Array.isArray(p.detalles) ? p.detalles.join(', ') : '')
    }
  })
}

export async function getProductById(id) {
  return safeFetch(`${BASE}/${id}`)
}

export async function createProduct(payload) {
  const apiPayload = {
    idProductos: payload.id ?? 0,
    idAlmacen: payload.warehouseId ?? payload.warehouseId,
    idCategoria: payload.categoryId ?? payload.categoryId,
    nombre: payload.name ?? payload.nombre ?? '',
    precioCompra: payload.price ?? 0,
    precioActual: payload.price ?? 0,
    costoUnitario: payload.costoUnitario ?? payload.price ?? 0,
    stockActual: payload.quantity ?? 0,
    stockMinimo: payload.minStock ?? 0,
    stockMaximo: payload.maxStock ?? 0,
    descripcion: payload.description ?? ''
  }
  return safeFetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(apiPayload)
  })
}

export async function updateProduct(id, payload) {
  const apiPayload = {
    idProductos: id ?? payload.id ?? 0,
    idAlmacen: payload.warehouseId ?? payload.idAlmacen,
    idCategoria: payload.categoryId ?? payload.idCategoria,
    nombre: payload.name ?? payload.nombre ?? '',
    precioCompra: payload.price ?? 0,
    precioActual: payload.price ?? 0,
    costoUnitario: payload.costoUnitario ?? payload.price ?? 0,
    stockActual: payload.quantity ?? 0,
    stockMinimo: payload.minStock ?? 0,
    stockMaximo: payload.maxStock ?? 0,
    descripcion: payload.description ?? ''
  }
  return safeFetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(apiPayload)
  })
}

export async function deleteProduct(id) {
  return safeFetch(`${BASE}/${id}`, {
    method: 'DELETE'
  })
}
