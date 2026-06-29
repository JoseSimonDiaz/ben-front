import { Link, useLocation } from 'react-router-dom'
import { ROUTES } from '../constants/routes.js'

const links = [
  { to: ROUTES.HOME, label: 'Home', icon: 'home' },
  { to: ROUTES.QUIZ, label: 'Quiz', icon: 'quiz' },
  { to: ROUTES.CHAT, label: 'AI Chat', icon: 'smart_toy' },
  { to: ROUTES.EXPERIENCE, label: 'Experiencia', icon: 'forum' },
  { to: ROUTES.CAREERS, label: 'Explore', icon: 'explore' },
]

function NavLinkItems({ links, index, currentPath }) {
  if (!links || index >= links.length) return null
  const { to, label } = links[index]
  const active = currentPath === to
  return (
    <>
      <Link
        key={to}
        to={to}
        className={`transition-all font-label-md text-label-md px-xs py-1 rounded-lg ${
          active
            ? 'text-primary font-bold'
            : 'text-on-surface-variant hover:bg-surface-container-high'
        }`}
      >
        {label}
      </Link>
      <NavLinkItems links={links} index={index + 1} currentPath={currentPath} />
    </>
  )
}

export default function Header() {
  const { pathname } = useLocation()

  return (
    <header className="fixed top-0 w-full z-50 bg-surface-container-low/80 backdrop-blur-md border-b border-outline-variant/50">
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 w-full max-w-[1280px] mx-auto">
        <Link to={ROUTES.HOME} className="flex items-center gap-xs">
          <span className="material-symbols-outlined text-primary text-2xl">terminal</span>
          <span className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary tracking-tight">Ben</span>
        </Link>
        <nav className="hidden md:flex items-center gap-md">
          <NavLinkItems links={links} index={0} currentPath={pathname} />
        </nav>
        <div className="flex items-center gap-xs">
          <Link to={ROUTES.ADMIN} className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high p-2 rounded-full transition-all active:scale-95 cursor-pointer">
            dashboard_customize
          </Link>
          <span className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high p-2 rounded-full transition-all active:scale-95 cursor-pointer">
            account_circle
          </span>
        </div>
      </div>
    </header>
  )
}
