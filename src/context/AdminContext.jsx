import { createContext, useContext, useState, useMemo } from 'react'

const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const [apiKey, setApiKey] = useState(() => sessionStorage.getItem('adminKey'))

  const value = useMemo(() => ({
    apiKey,
    isAdmin: !!apiKey,
    login(key) {
      setApiKey(key)
      sessionStorage.setItem('adminKey', key)
    },
    logout() {
      setApiKey(null)
      sessionStorage.removeItem('adminKey')
    },
  }), [apiKey])

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdminAuth() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminProvider')
  return ctx
}
