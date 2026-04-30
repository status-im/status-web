import { CardDetail } from './card-detail'

type Props = {
  traits: Record<string, unknown>
}

const CollectibleTraits = ({ traits }: Props) => {
  const entries = Object.entries(traits).filter(([, value]) => {
    if (typeof value === 'object' && value !== null) {
      const valueObj = value as Record<string, unknown>
      if ('parent' in valueObj && 'child' in valueObj) {
        return false
      }
    }
    return true
  })

  if (entries.length === 0) return null

  return (
    <div>
      <div className="mb-3 text-15 font-semibold text-neutral-100">Traits</div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(155px,1fr))] gap-3">
        {entries.map(([trait, value], index) => {
          const displayValue =
            typeof value === 'object' && value !== null
              ? JSON.stringify(value)
              : String(value)

          return (
            <CardDetail key={index} title={trait}>
              <div className="text-13 font-medium text-neutral-100">
                {displayValue}
              </div>
            </CardDetail>
          )
        })}
      </div>
    </div>
  )
}

export { CollectibleTraits }
