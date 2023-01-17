import type { SVGAttributes } from 'react'

export interface IconProps extends SVGAttributes<SVGElement> {
  children?: never
  width?: never
  height?: never
  color?: string
  size?: number
}
