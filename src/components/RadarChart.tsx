import type { PackDimension } from '../content/schema'

type RadarChartProps = {
  dimensions: PackDimension[]
  values: Record<string, number>
  accent: string
}

const size = 300
const center = size / 2
const radius = 96

const polarPoint = (axisCount: number, index: number, distance: number) => {
  const angle = -Math.PI / 2 + (Math.PI * 2 * index) / axisCount
  return {
    x: center + Math.cos(angle) * distance,
    y: center + Math.sin(angle) * distance,
  }
}

const pathFromPoints = (points: { x: number; y: number }[]) =>
  points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ') +
  ' Z'

const normalizeAxisValue = (value: number | undefined) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 0
  }

  return Math.min(1, Math.max(-1, value))
}

export function RadarChart({ dimensions, values, accent }: RadarChartProps) {
  const polygonPoints = dimensions.map((dimension, index) =>
    polarPoint(
      dimensions.length,
      index,
      ((normalizeAxisValue(values[dimension.id]) + 1) / 2) * radius,
    ),
  )

  const rings = [0.25, 0.5, 0.75, 1]

  return (
    <svg
      className="radar-chart"
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="歌词维度雷达图"
    >
      {rings.map((ring) => {
        const ringPoints = dimensions.map((_, index) =>
          polarPoint(dimensions.length, index, radius * ring),
        )
        return (
          <path
            key={ring}
            d={pathFromPoints(ringPoints)}
            className="radar-ring"
          />
        )
      })}

      {dimensions.map((dimension, index) => {
        const outerPoint = polarPoint(dimensions.length, index, radius)
        const labelPoint = polarPoint(dimensions.length, index, radius + 28)

        return (
          <g key={dimension.id}>
            <line
              className="radar-axis"
              x1={center}
              y1={center}
              x2={outerPoint.x}
              y2={outerPoint.y}
            />
            <text
              className="radar-label"
              x={labelPoint.x}
              y={labelPoint.y}
              textAnchor="middle"
            >
              {dimension.shortName}
            </text>
          </g>
        )
      })}

      <path
        d={pathFromPoints(polygonPoints)}
        fill={accent}
        opacity="0.22"
      />

      <path
        d={pathFromPoints(polygonPoints)}
        fill="none"
        stroke={accent}
        strokeWidth="2.5"
      />

      {polygonPoints.map((point, index) => (
        <circle
          key={dimensions[index].id}
          cx={point.x}
          cy={point.y}
          r="4"
          fill={accent}
        />
      ))}
    </svg>
  )
}
