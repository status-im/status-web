type Props = {
  tickValuesY: number[]
}

const YAxis = (props: Props) => {
  const { tickValuesY } = props

  return (
    <div className="absolute bottom-0 left-1 flex h-[160px] flex-col-reverse items-end justify-between">
      {tickValuesY.map((value, index) => {
        return (
          <p key={index} className="text-11 font-medium text-neutral-40">
            {Math.abs(value) >= 1000
              ? `${(value / 1000).toFixed(1)}k`.replace(/\.0+k$/, 'k')
              : value.toString()}
          </p>
        )
      })}
    </div>
  )
}

export { YAxis }
