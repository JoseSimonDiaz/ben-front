import { Link, useLocation } from 'react-router-dom'
import { ROUTES } from '../constants/routes.js'

const items = [
  { to: ROUTES.HOME, label: 'Home', icon: 'home' },
  { to: ROUTES.QUIZ, label: 'Quiz', icon: 'quiz' },
  { to: ROUTES.CHAT, label: 'AI Chat', icon: 'smart_toy' },
  { to: ROUTES.CAREERS, label: 'Explore', icon: 'explore' },
  { to: ROUTES.ADMIN, label: 'Admin', icon: 'dashboard_customize' },
]

function NavItems({ items, index, currentPath }) {
  if (!items || index >= items.length) return null
  const { to, label, icon } = items[index]
  const active = currentPath === to
  return (
    <>
      <Link
        key={to}
        to={to}
        className={`flex flex-col items-center justify-center transition-all active:scale-90 duration-150 ${
          active
            ? 'bg-primary-container text-on-primary-container rounded-full px-4 py-1'
            : 'text-on-surface-variant p-2 hover:text-primary'
        }`}
      >
        <span className="material-symbols-outlined text-xl">{icon}</span>
        <span className="font-label-md text-[10px] leading-none mt-1">{label}</span>
      </Link>
      <NavItems items={items} index={index + 1} currentPath={currentPath} />
    </>
  )
}

export default function BottomNav() {
  const { pathname } = useLocation()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 bg-surface-container-high/90 backdrop-blur-md border-t border-outline-variant/50 rounded-t-xl shadow-md">
      <NavItems items={items} index={0} currentPath={pathname} />
    </nav>
  )
}
