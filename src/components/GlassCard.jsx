export default function GlassCard({ children, className = '' }) {
  return (
    <div className={`glass-panel rounded-2xl ${className}`}>
      {children}
    </div>
  )
}
