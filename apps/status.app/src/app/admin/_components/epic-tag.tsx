'use client'

import { useState } from 'react'

import { CloseIcon } from '@status-im/icons/12'

import { getColorWithOpacity } from '~app/_utils/get-color-with-opacity'

type Props = {
  label: string
  color: `#${string}`
  onRemove?: () => void
}

const EpicTag = (props: Props) => {
  const { label, color: colorFromProps, onRemove } = props
  const hoverColor = getColorWithOpacity(colorFromProps, 1)
  const defaultColor = getColorWithOpacity(colorFromProps, 0.5)

  const [isHovered, setIsHovered] = useState(false)
  const color = isHovered ? hoverColor : defaultColor

  return (
    <div
      className="group flex h-6 select-none items-center justify-between rounded-20 border bg-white-100 transition-colors"
      onMouseEnter={() => onRemove && setIsHovered(true)}
      onMouseLeave={() => onRemove && setIsHovered(false)}
      style={{
        borderColor: color,
        color: color,
      }}
    >
      <p className="whitespace-nowrap px-2 text-13 font-medium">{label}</p>
      {onRemove && (
        <button
          onClick={onRemove}
          className="flex size-6 items-center justify-center border-l pr-0.5 transition-colors"
          style={{
            borderColor: color,
          }}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  )
}

export { EpicTag }
