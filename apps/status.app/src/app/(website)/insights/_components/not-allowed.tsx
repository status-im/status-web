import { Button, Text } from '@status-im/components'
import Image from 'next/image'

const NotAllowed = () => {
  return (
    <div className="relative flex size-full min-h-[calc(100vh-56px-4px)] flex-col items-center justify-center rounded-[24px] bg-white-100">
      <div className="relative flex size-full items-center justify-center">
        <div className="relative z-10 flex flex-col items-center justify-center">
          <Image
            alt="Not available for mobile"
            src="/assets/chart/empty.png"
            width={80}
            height={80}
          />
          <div className="pb-3" />
          <Text size={15} weight="semibold">
            Not available for mobile
          </Text>
          <div className="pb-1" />
          <Text size={13} color="$neutral-50">
            Try to open insights on a desktop or tablet.
          </Text>
          <div className="pt-5">
            <Button size="32" variant="outline" href="/">
              Go to status.app
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export { NotAllowed }
