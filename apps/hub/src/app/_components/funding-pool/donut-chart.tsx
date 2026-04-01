'use client'

type Segment = {
  label: string
  value: number
  color: string
}

type DonutChartProps = {
  segments: Segment[]
  size?: number
  strokeWidth?: number
}

const DonutChart = ({
  segments,
  size = 280,
  strokeWidth = 60,
}: DonutChartProps) => {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const center = size / 2

  const total = segments.reduce((sum, s) => sum + s.value, 0)

  let offset = 0

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="block h-auto w-full">
      {segments.map((segment, i) => {
        const segmentLength = (segment.value / total) * circumference
        const rotation = (offset / circumference) * 360 - 90

        offset += segmentLength

        return (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
            strokeDashoffset={0}
            transform={`rotate(${rotation} ${center} ${center})`}
            className="transition-all duration-500 ease-in-out"
          />
        )
      })}

      <image
        href="/logo.svg"
        x={center - 32}
        y={center - 32}
        width="64"
        height="64"
      />
    </svg>
  )
}

export { DonutChart }
export type { Segment }
