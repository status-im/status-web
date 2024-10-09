import * as BaseSwitch from '@radix-ui/react-switch'

type Props = {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}

const Switch = (props: Props) => {
  return (
    <BaseSwitch.Root
      className="relative h-[20px] w-[30px] cursor-default rounded-full bg-neutral-30 outline-none data-[disabled]:cursor-not-allowed data-[state=checked]:bg-customisation-blue-50 data-[disabled]:opacity-30"
      {...props}
    >
      <BaseSwitch.Thumb className="block size-[16px] translate-x-0.5 rounded-full bg-white-100 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[12px]" />
    </BaseSwitch.Root>
  )
}

export { Switch }
