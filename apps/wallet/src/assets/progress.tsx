interface ProgressProps {
  stroke: string
  progress?: number
  size?: number
  strokeWidth?: number
}

const Progress = ({
  stroke,
  progress = 0,
  size = 16,
  strokeWidth = 1.2,
}: ProgressProps) => {
  const normalizedProgress = Math.min(Math.max(progress, 0), 100)
  const radius = size / 2 - strokeWidth * 1.5
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (normalizedProgress / 100) * circumference

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      className="-rotate-90 transform" // Rotate to start from top
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={stroke}
        strokeOpacity="0.2"
        strokeWidth={strokeWidth}
      />

      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        fill="none"
      />
    </svg>
  )
}

export default Progress
