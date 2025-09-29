import { CheckIcon } from '@status-im/icons/16'

type Props = {
  selected: boolean
}

const SelectionIndicator = (props: Props) => {
  const { selected } = props

  return selected ? (
    <div className="flex size-5 items-center justify-center rounded-8 bg-customisation-blue-50 hover:bg-customisation-blue-60">
      <CheckIcon className="text-white-100" />
    </div>
  ) : (
    <div className="flex size-5 rounded-8 border border-neutral-20 bg-white-100 hover:border-neutral-30" />
  )
}

export { SelectionIndicator }
