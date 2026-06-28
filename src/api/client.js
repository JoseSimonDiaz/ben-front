import { config } from '../config.js'

function getAdminKey() {
  try { return sessionStorage.getItem('adminKey') } catch { return null }
}

export default async function request(path, { method, body, headers } = {}) {
  const res = await fetch(`${config.API_BASE}${path}`, {
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
