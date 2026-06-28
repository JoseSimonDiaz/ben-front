import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="hidden md:block border-t border-outline-variant/20 mt-xl">
      <div className="max-w-[1280px] mx-auto px-margin-desktop py-lg flex justify-between items-center text-on-surface-variant font-label-md text-label-md">
        <div className="flex items-center gap-xs">
          <span className="material-symbols-outlined text-primary text-lg">terminal</span>
          <span className="font-bold">Ben &copy; {new Date().getFullYear()}</span>
        </div>
        <div className="flex gap-md">
          <span className="hover:text-primary transition-colors cursor-pointer">Privacidad</span>
          <span className="hover:text-primary transition-colors cursor-pointer">T&eacute;rminos</span>
          <span className="hover:text-primary transition-colors cursor-pointer">Contacto</span>
        </div>
      </div>
    </footer>
  )
}
