type Props = {
  ticks: string[]
  width: number
}

const YAxis = ({ ticks, width }: Props) => (
  <div className="absolute -bottom-2 left-0 z-10 flex size-full flex-col-reverse items-start justify-between">
    {ticks.map((value, index) => (
      <div key={index} className="flex w-full items-center justify-start">
        <div
          className="h-px w-full border-t border-dashed border-neutral-10"
          style={{ width }}
        />
        <div className="flex-1 items-end">
          <p className="text-right text-11 font-medium text-neutral-40">
            {value}
          </p>
        </div>
      </div>
    ))}
  </div>
)

export { YAxis }
