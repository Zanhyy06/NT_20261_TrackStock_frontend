const BASE = 'http://localhost:8080/categoria';

async function safeFetch(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

export async function getCategorias() {
  const data = await safeFetch(BASE);
  if (!Array.isArray(data)) return [];
  return data.map((c, idx) => ({
    id:          c.idCategoria ?? `cat_${Date.now()}_${idx}`,
    name:        c.nombre      ?? 'N/A',
    description: c.descripcion ?? '',
    color:       c.color       ?? '#2563eb'
  }));
}

export async function createCategoria(payload) {
  return safeFetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre:      payload.nombre      ?? payload.name        ?? '',
      descripcion: payload.descripcion ?? payload.description ?? '',
      color:       payload.color       ?? '#2563eb'
    }),
  });
}

export async function updateCategoria(id, payload) {
  return safeFetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre:      payload.nombre      ?? payload.name        ?? '',
      descripcion: payload.descripcion ?? payload.description ?? '',
      color:       payload.color       ?? '#2563eb'
    }),
  });
}

export async function deleteCategoria(id) {
  return safeFetch(`${BASE}/${id}`, { method: 'DELETE' });
}