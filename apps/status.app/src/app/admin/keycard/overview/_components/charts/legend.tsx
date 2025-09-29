type Props = {
  data: { color: `#${string}`; label: string; dashed?: boolean }[]
}
const Legend = (props: Props) => {
  const { data } = props

  return (
    <div className="flex h-[46px] items-center justify-center gap-6 px-4 pb-5">
      {data.map((d, index) => {
        return (
          <div key={index} className="flex items-center gap-2">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 6H12"
                stroke={d.color}
                strokeWidth="2"
                {...(d.dashed && {
                  strokeDasharray: '0.3 3.5',
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round',
                })}
              />
            </svg>
            <p className="text-13 font-medium text-neutral-100">{d.label}</p>
          </div>
        )
      })}
    </div>
  )
}

export { Legend }
