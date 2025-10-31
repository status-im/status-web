'use client'

interface SliderConfig {
  minLabel: string
  maxLabel: string
  minDays: number
  maxDays: number
}

interface LockDurationSliderProps {
  sliderConfig: SliderConfig
  value: number
  onChange: (value: number) => void
}

/**
 * Slider component for selecting vault lock duration
 */
export function LockDurationSlider(props: LockDurationSliderProps) {
  const { sliderConfig, value, onChange } = props

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDays = parseFloat(e.target.value)
    onChange(inputDays)
  }

  return (
    <div className="flex flex-col gap-4 px-8 py-4">
      <div className="flex flex-col items-center justify-center px-0 pb-1 pt-0">
        <input
          type="range"
          min={sliderConfig.minDays}
          max={sliderConfig.maxDays}
          step="any"
          value={value}
          onChange={handleSliderChange}
          className="h-1 w-full cursor-pointer appearance-none rounded-full bg-neutral-10 [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-purple [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple"
        />
      </div>
      <div className="flex items-start justify-between text-13 font-medium text-neutral-50">
        <span>{sliderConfig.minLabel}</span>
        <span>{sliderConfig.maxLabel}</span>
      </div>
    </div>
  )
}
