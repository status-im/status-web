import { customisation } from '@status-im/colors'

import { features } from '~website/_features'

import type { FeatureType } from '~website/_features'

type Props = {
  type: FeatureType
}

const FeatureTag = (props: Props) => {
  const { icon, theme, name } = features[props.type]

  return (
    <div
      className="flex h-8 cursor-default select-none items-center justify-center gap-1 rounded-full border pl-2 pr-3"
      style={{
        color: customisation[theme]['50'],
        backgroundColor: customisation[theme]['50/5'],
        borderColor: customisation[theme]['50/30'],
      }}
    >
      {icon}
      <span className="text-15 font-medium">{name}</span>
    </div>
  )
}

export { FeatureTag }
