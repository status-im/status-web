type CircularProgressProps = {
  completed: number
  total: number
}

const CircularProgress = ({ completed, total }: CircularProgressProps) => {
  const radius = 6
  const stroke = 1.1
  const normalizedRadius = radius - stroke * 0.5
  const circumference = normalizedRadius * 2 * Math.PI

  const strokeDashoffset =
    total === 0
      ? circumference
      : circumference - (completed / total) * circumference

  return (
    <div className="relative inline-flex min-w-[12] items-center justify-center gap-1 rounded-20 border border-neutral-20 px-2 py-0.5">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="relative z-20 flex shrink-0"
      >
        <circle
          stroke="#09101C"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          transform={`rotate(-90 ${radius} ${radius})`}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#647084"
          fill="transparent"
          opacity="0.2"
          strokeWidth={stroke}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="absolute left-0"
        />
      </svg>

      <span className="relative z-10 text-13 font-medium text-neutral-100">
        {completed}/{total}
      </span>
    </div>
  )
}

export { CircularProgress }
