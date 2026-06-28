export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-xl px-lg py-4 text-sm font-bold transition-all active:scale-95 duration-150'
  const variants = {
    primary: 'bg-primary-container text-on-primary-container shadow-lg shadow-primary-container/20 hover:scale-105',
    secondary: 'glass-panel text-on-surface font-semibold hover:bg-surface-container-highest',
    ghost: 'text-on-surface-variant hover:text-primary',
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
