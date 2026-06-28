export default function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100)

  return (
    <div className="w-full">
      <div className="flex justify-between text-label-md text-on-surface-variant mb-xs">
        <span>Pregunta {current} de {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
