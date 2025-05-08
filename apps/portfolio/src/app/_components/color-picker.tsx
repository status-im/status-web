import { AlertIcon, CheckIcon } from '@status-im/icons/16'
import { cva } from 'class-variance-authority'
import { useController } from 'react-hook-form'

import { COLORS } from '../_utils/get-default-values'

type Props = {
  name: string
  label?: string
}

const styles = cva(
  'relative flex size-6 items-center justify-center transition-opacity',
  {
    variants: {
      selected: {
        true: 'opacity-[100%]',
        false: 'opacity-[0%]',
      },
    },
  }
)

const ColorPicker = (props: Props): JSX.Element => {
  const { name, label = 'Colour' } = props

  const {
    field,
    fieldState: { error },
  } = useController({ name })

  return (
    <div>
      <p className="pb-1 text-13 font-medium text-neutral-50">{label}</p>

      <div className="flex">
        {COLORS.map(color => {
          const colorValue = color // customisation[`${color}-50`]

          return (
            <div
              key={color}
              className="flex size-8 items-center justify-center"
              data-customisation={colorValue}
            >
              <button
                type="button"
                onClick={() => field.onChange(colorValue)}
                className="flex size-6 items-center justify-center rounded-full bg-customisation-50"
              >
                <div
                  className={styles({ selected: field.value === colorValue })}
                >
                  <div className="absolute size-7 rotate-180 rounded-full bg-transparent bg-[conic-gradient(at_bottom,_var(--tw-gradient-stops))] from-customisation-50/20 to-customisation-50/40" />
                  <CheckIcon className="z-10 text-white-100" />
                </div>
              </button>
            </div>
          )
        })}
      </div>
      {error?.message && (
        <p
          role="alert"
          className="mt-1 flex items-center gap-1 text-13 text-danger-50"
        >
          <AlertIcon className="text-danger-50" />
          {error.message}
        </p>
      )}
    </div>
  )
}

export { ColorPicker }
