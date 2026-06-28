const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api/v1'

function getAdminKey() {
  try { return sessionStorage.getItem('adminKey') } catch { return null }
}

export default async function request(path, { method, body, headers } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    body,
    headers: {
      'Content-Type': 'application/json',
      ...(getAdminKey() ? { 'x-api-key': getAdminKey() } : {}),
      ...headers,
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || err.error || `Error ${res.status}`)
  }
  return res.json()
}
