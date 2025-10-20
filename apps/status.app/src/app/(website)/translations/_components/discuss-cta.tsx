import { Button } from '@status-im/components'

import { DISCUSS_TRANSLATE_URL } from '~/config/routes'

export const DiscussCTA = () => {
  return (
    <div data-background="blur" className="contents">
      <Button variant="outline" href={DISCUSS_TRANSLATE_URL}>
        Discuss translating Status
      </Button>
    </div>
  )
}
