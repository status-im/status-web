import { Button, Tag } from '@status-im/components'

import { Image } from '~components/assets'
import { ParallaxCircle } from '~website/_components/parallax-circle'

type Props = {
  jobsCount: number
}

const Prefooter = (props: Props) => {
  const { jobsCount } = props

  return (
    <div className="border-dashed-default relative border-t xl:overflow-hidden">
      <ParallaxCircle
        color="purple"
        className="bottom-[-338px] right-0 hidden xl:block"
      />

      {/* STICKERS */}
      <Image
        id="Manifesto/Stickers/02:412:412"
        alt=""
        className="absolute left-9 right-auto top-0 z-[1] -translate-y-1/2 xl:left-auto xl:right-[330px] xl:top-40"
        width={112}
        height={112}
      />
      <Image
        id="Manifesto/Stickers/01:407:407"
        alt=""
        className="absolute left-52 top-28 z-[1] hidden xl:block 2xl:top-40"
        width={112}
        height={112}
      />

      <div className="container relative z-10 flex flex-col items-center py-24 xl:py-40">
        <div className="mb-4">
          <Tag size="32" label="Jobs" />
        </div>
        <p className="mb-8 text-center text-40 font-bold xl:text-64">
          Join a mission driven
          <br />
          organisation
        </p>
        <Button href="/jobs" variant="outline">
          {jobsCount} opening{jobsCount === 1 ? '' : 's'} available
        </Button>
      </div>
    </div>
  )
}

export { Prefooter }
