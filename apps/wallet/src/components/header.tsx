import { Button } from '@status-im/components'
import { ArrowLeftIcon } from '@status-im/icons/20'

const Header = ({ className }: { className?: string }) => {
  return (
    <div className={`pb-4 ${className}`}>
      <Button
        href="/onboarding"
        variant="grey"
        icon={<ArrowLeftIcon color="$neutral-100" />}
        aria-label="Back"
        size="32"
      />
    </div>
  )
}

export default Header
