import { CheckIcon } from '@status-im/icons/16'
import { cva } from 'class-variance-authority'
import { useController } from 'react-hook-form'

type Props = {
  name: string
  label?: string
}

const colors: string[] = [
  '#2A4AF5',
  '#7140FD',
  '#FF7D46',
  '#216266',
  '#1992D7',
  '#F6B03C',
  '#F66F8F',
  '#CB6256',
  '#C78F67',
  '#EC266C',
]

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

const ColorPicker = (props: Props) => {
  const { name, label = 'Colour' } = props

  const {
    field,
    fieldState: { error },
  } = useController({ name })

  return (
    <div>
      <p className="pb-1 text-13 font-medium text-neutral-50">{label}</p>

      <div className="flex">
        {colors.map(color => {
          const colorValue = color // customisation[`${color}-50`]

          return (
            <div
              key={color}
              className="flex size-8 items-center justify-center"
            >
              <button
                type="button"
                onClick={() => field.onChange(colorValue)}
                className="flex size-6 items-center justify-center rounded-full"
                style={{ backgroundColor: color }}
              >
                <div
                  className={styles({ selected: field.value === colorValue })}
                >
                  <div
                    className="absolute size-7 rotate-45 rounded-full border-2 bg-transparent"
                    style={{
                      borderBottomColor: color,
                      borderLeftColor: color,
                      borderRightColor: color,
                      borderTopColor: color,
                    }}
                  ></div>
                  <CheckIcon className="text-white-100" />
                </div>
              </button>
            </div>
          )
        })}
      </div>
      {error?.message && (
        <p className="mt-1 text-13 text-danger-50">{error.message}</p>
      )}
    </div>
  )
}

export { ColorPicker }
