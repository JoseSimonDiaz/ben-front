import { useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminContext.jsx'
import { ROUTES } from '../constants/routes.js'

const sidebarLinks = [
  { to: ROUTES.ADMIN_DASHBOARD, icon: 'dashboard', label: 'Dashboard' },
  { to: ROUTES.ADMIN_SETTINGS, icon: 'settings', label: 'Configuración' },
]

function SidebarLinkList({ links, index }) {
  if (!links || index >= links.length) return null
  const link = links[index]
  return (
    <>
      <a
        href={link.to}
        className="flex items-center gap-4 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all group"
      >
        <span className="material-symbols-outlined group-hover:text-primary">{link.icon}</span>
        <span className="font-label-md text-label-md">{link.label}</span>
      </a>
      <SidebarLinkList links={links} index={index + 1} />
    </>
  )
}

export default function AdminLayout({ children }) {
  const { isAdmin, logout } = useAdminAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAdmin) navigate(ROUTES.ADMIN_LOGIN)
  }, [isAdmin, navigate])

  if (!isAdmin) return null

  return (
    <div className="flex min-h-screen bg-background font-body-md overflow-hidden">
      <aside className="w-64 bg-surface-container-low border-r border-outline-variant/30 hidden md:flex flex-col z-50">
        <div className="h-16 flex items-center px-lg gap-3">
          <span className="material-symbols-outlined text-primary text-3xl">terminal</span>
          <span className="font-headline-lg text-headline-lg font-bold text-primary tracking-tight">Ben</span>
        </div>
        <nav className="flex-1 mt-lg space-y-2 px-3">
          <SidebarLinkList links={sidebarLinks} index={0} />
        </nav>
        <div className="p-4 mt-auto">
          <div className="glass-card rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center border border-primary/30">
              <span className="material-symbols-outlined text-primary">account_circle</span>
            </div>
            <div className="overflow-hidden flex-1">
              <p className="font-bold text-sm truncate">Admin Principal</p>
            </div>
            <button onClick={logout} className="text-on-surface-variant hover:text-error transition-colors">
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-surface">
        <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 h-16 flex items-center justify-between px-margin-desktop">
          <div className="flex items-center gap-4">
            <h1 className="font-headline-lg text-headline-lg tracking-tight">Admin Dashboard</h1>
            <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] uppercase font-bold tracking-widest">Live</span>
          </div>
        </header>
        <div className="p-margin-desktop max-w-[1280px] mx-auto w-full space-y-lg flex-1">
          {children || <Outlet />}
        </div>
        <footer className="p-margin-desktop border-t border-outline-variant/10 mt-auto flex justify-between items-center text-on-surface-variant/50 text-xs">
          <p>&copy; 2024 Ben AI</p>
          <div className="flex gap-4">
            <span className="hover:text-primary cursor-pointer">Privacy</span>
            <span className="hover:text-primary cursor-pointer">Terms</span>
          </div>
        </footer>
      </main>
    </div>
  )
}
