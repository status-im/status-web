import { Input } from '@status-im/components'
import { AlertIcon } from '@status-im/icons/20'

type Props = {
  value: string
  onChange: (val: string) => void
  showError: boolean
  errorMessage?: string
}

const AddressField = ({
  value,
  onChange,
  showError,
  errorMessage = 'The address is not valid',
}: Props) => {
  return (
    <div>
      <div className="px-4 pb-2">
        <Input
          label="To"
          placeholder="Address"
          value={value}
          onChange={val => onChange(val)}
          isInvalid={showError}
          clearable={!!value}
          className="font-mono text-13"
          autoComplete="off"
        />
      </div>
      {showError && (
        <div className="flex items-center gap-1 px-5 pb-4 pt-2 text-13 text-danger-50">
          <AlertIcon className="size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  )
}

export { AddressField }
