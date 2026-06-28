import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminContext.jsx'
import { ROUTES } from '../constants/routes.js'

export default function AdminLogin() {
  const [key, setKey] = useState('')
  const [error, setError] = useState('')
  const { login } = useAdminAuth()
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    if (!key.trim()) {
      setError('Ingresá la API key de administrador')
      return
    }
    login(key.trim())
    navigate(ROUTES.ADMIN_DASHBOARD)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-margin-mobile">
      <div className="w-full max-w-md glass-panel rounded-2xl p-xl animate-fade-up">
        <div className="text-center mb-xl">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-4xl text-primary">terminal</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg mb-2">Admin Login</h1>
          <p className="text-sm text-on-surface-variant">Ingresá tu clave de administrador para acceder al panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-lg">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-on-surface-variant">API Key</label>
            <input
              type="password"
              value={key}
              onChange={(e) => { setKey(e.target.value); setError('') }}
              placeholder="Ingresá tu API key..."
              className="w-full rounded-xl border border-outline-variant/30 bg-surface-container px-4 py-3 text-sm outline-none focus:border-primary/50 transition-colors text-on-surface placeholder:text-on-surface-variant/50"
            />
            {error && <p className="text-xs text-error mt-1">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-on-primary rounded-xl py-3 font-bold text-sm hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  )
}
