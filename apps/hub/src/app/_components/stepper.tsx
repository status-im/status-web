import { classes } from '~utils/classes'

type StepperProps = {
  numberOfSteps: number
  activeStep: number
}

export default function Stepper({ numberOfSteps, activeStep }: StepperProps) {
  return (
    <div className="flex items-end">
      {Array.from({ length: numberOfSteps }).map((_, index) => (
        <div
          key={`step-${index}`}
          className={classes([index !== numberOfSteps - 1, 'w-full'])}
        >
          <div className="flex items-center">
            <div
              className={classes(
                'bg-white -mx-px flex size-14 shrink-0 items-center justify-center rounded-full border-2 p-1.5',
                [index > activeStep, 'border-dark-8'],
                [index < activeStep, 'bg-dark-8'],
                [index === activeStep, 'border-[#7140FD]']
              )}
            >
              <span
                className={classes(
                  'text-base text-neutral-500 font-bold',
                  [index < activeStep, 'text-white-100'],
                  [index === activeStep, 'text-[#7140FD]']
                )}
              >
                {index + 1}
              </span>
            </div>
            {index !== numberOfSteps - 1 && (
              <div
                className={classes(
                  'h-1 w-full border-t-4 border-dotted',
                  [index >= activeStep, 'border-dark-8'],
                  [index < activeStep, 'border-[#7140FD]']
                )}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
