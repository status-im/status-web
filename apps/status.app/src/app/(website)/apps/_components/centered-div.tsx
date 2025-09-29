'use client'

import { useElementOnCenter } from '~hooks/use-element-on-center'

export const CenteredDiv = (props: React.ComponentPropsWithoutRef<'div'>) => {
  const { ref } = useElementOnCenter()
  return <div {...props} ref={ref} />
}
