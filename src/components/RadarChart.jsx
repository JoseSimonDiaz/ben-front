export default function RadarChart({ data, max = 10, size = 200 }) {
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 20
  const angleStep = (Math.PI * 2) / data.length
  const levels = [0.25, 0.5, 0.75, 1]

  function point(index, value) {
    const angle = angleStep * index - Math.PI / 2
    const ratio = value / max
    return {
      x: cx + r * ratio * Math.cos(angle),
      y: cy + r * ratio * Math.sin(angle),
    }
  }

  const polygon = data.map((d, i) => {
    const p = point(i, d.value)
    return `${p.x},${p.y}`
  }).join(' ')

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {levels.map((level) => {
        const pts = data.map((_, i) => {
          const angle = angleStep * i - Math.PI / 2
          return `${cx + r * level * Math.cos(angle)},${cy + r * level * Math.sin(angle)}`
        }).join(' ')
        return <polygon key={level} points={pts} className="radar-grid" opacity={level} />
      })}

      {data.map((_, i) => {
        const angle = angleStep * i - Math.PI / 2
        const x2 = cx + r * Math.cos(angle)
        const y2 = cy + r * Math.sin(angle)
        return <line key={i} x1={cx} y1={cy} x2={x2} y2={y2} className="radar-grid" />
      })}

      <polygon points={polygon} className="radar-area" />

      {data.map((d, i) => {
        const p = point(i, d.value)
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="#cebdff" />
            <text
              x={point(i, max + 1).x}
              y={point(i, max + 1).y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[11px]"
              fill="#cac4d4"
              fontSize="11"
            >
              {d.label.toUpperCase()}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
