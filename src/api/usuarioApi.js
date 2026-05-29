const BASE = 'http://localhost:8080/usuario';

async function safeFetch(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

function normalizeUserRole(value) {
  const role = `${value ?? ''}`.trim().toLowerCase();
  if (['admin', 'administrador'].includes(role))              return 'admin';
  if (['gerente'].includes(role))                             return 'gerente';
  if (['almacenero', 'almacen', 'almacén', 'almacenista'].includes(role)) return 'almacenero';
  if (['vendedor'].includes(role))                            return 'vendedor';
  if (['cliente', 'client'].includes(role))                   return 'cliente';
  return 'cliente';
}

export async function getUsuarios() {
  const data = await safeFetch(BASE);
  if (!Array.isArray(data)) return [];
  return data.map((u, idx) => ({
    id:          u.idUsuario  ?? `usr_${Date.now()}_${idx}`,
    role:        normalizeUserRole(u.tipo ?? 'cliente'),
    displayRole: u.tipo       ?? 'cliente',
    type:        u.tipo       ?? 'N/A',
    name:        u.nombreEmpresa ?? 'N/A',
    document:    u.documentoNit  ?? '',
    phone:       u.telefono      ?? '',
    email:       u.correo        ?? '',
    address:     u.direccion     ?? '',
    createdAt:   u.createdAt     ?? null,
  }));
}

export async function createUsuario(payload) {
  return safeFetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tipo:          payload.tipo          ?? payload.role     ?? '',
      nombreEmpresa: payload.nombreEmpresa ?? payload.name     ?? '',
      documentoNit:  payload.documentoNit  ?? payload.document ?? '',
      telefono:      payload.telefono      ?? payload.phone    ?? '',
      correo:        payload.correo        ?? payload.email    ?? '',
      direccion:     payload.direccion     ?? payload.address  ?? '',
    }),
  });
}

export async function updateUsuario(id, payload) {
  return safeFetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tipo:          payload.tipo          ?? payload.role     ?? '',
      nombreEmpresa: payload.nombreEmpresa ?? payload.name     ?? '',
      documentoNit:  payload.documentoNit  ?? payload.document ?? '',
      telefono:      payload.telefono      ?? payload.phone    ?? '',
      correo:        payload.correo        ?? payload.email    ?? '',
      direccion:     payload.direccion     ?? payload.address  ?? '',
    }),
  });
}

export async function deleteUsuario(id) {
  return safeFetch(`${BASE}/${id}`, { method: 'DELETE' });
}