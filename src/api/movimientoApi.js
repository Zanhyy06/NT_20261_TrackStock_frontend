const BASE = 'http://localhost:8080/movimiento';

async function safeFetch(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

export async function getMovimientos() {
  const data = await safeFetch(BASE);
  if (!Array.isArray(data)) return [];
  return data.map((m, idx) => ({
    id:        m.idMovimiento ?? `mov_${Date.now()}_${idx}`,
    userId:    m.idUsuario    ?? null,
    date:      m.fecha        ?? '',
    type:      m.tipo?.toLowerCase() ?? 'entrada',
    createdAt: m.fecha        ?? new Date().toISOString(),
  }));
}

export async function createMovimiento(movimiento) {
  const params = new URLSearchParams({
    idUsuario:   movimiento.idUsuario,
    tipo:        movimiento.tipo,        // "ENTRADA" o "SALIDA" en mayúsculas
    idProducto:  movimiento.idProducto,
    cantidad:    movimiento.cantidad,
    descripcion: movimiento.descripcion ?? ''
  });

  return safeFetch(`${BASE}/completo?${params}`, {
    method: 'POST',
  });
}

export async function deleteMovimiento(id) {
  return safeFetch(`${BASE}/${id}`, { method: 'DELETE' });
}