export const PasswordStrengthIndicator = ({
  score,
  size = 16,
}: {
  score: number
  size?: number
}) => {
  const radius = (size - 1.2) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - (score * 25) / 100)
  const center = size / 2

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeOpacity="0.2"
      />

      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        transform={`rotate(-90 ${center} ${center})`}
      />
    </svg>
  )
}
