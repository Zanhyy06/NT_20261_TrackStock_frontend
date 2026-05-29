const BASE = 'http://localhost:8080/almacen';

async function safeFetch(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

export async function getAlmacenes() {
  const data = await safeFetch(BASE);
  if (!Array.isArray(data)) return [];
  return data.map((a, idx) => ({
    id:       a.idAlmacen ?? `wh_${Date.now()}_${idx}`,
    name:     a.nombre    ?? 'N/A',
    location: a.direccion ?? '',
    capacity: Number(a.capacidad ?? 0) || 0
  }));
}

export async function createAlmacen(payload) {
  return safeFetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre:    payload.nombre    ?? payload.name     ?? '',
      direccion: payload.direccion ?? payload.location ?? '',
      capacidad: payload.capacidad ?? payload.capacity ?? 0
    }),
  });
}

export async function updateAlmacen(id, payload) {
  return safeFetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre:    payload.nombre    ?? payload.name     ?? '',
      direccion: payload.direccion ?? payload.location ?? '',
      capacidad: payload.capacidad ?? payload.capacity ?? 0
    }),
  });
}

export async function deleteAlmacen(id) {
  return safeFetch(`${BASE}/${id}`, { method: 'DELETE' });
}