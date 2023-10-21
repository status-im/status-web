import { opacity as colorOpacity } from '../consts/opacity'

export type RGBAColor = `rgba(${string} / ${string}%)`

export type HexColor = `#${string}`

type Opacity = keyof typeof colorOpacity

export function getColorWithOpacity(
  color: RGBAColor | HexColor,
  opacity: Opacity
): string {
  if (color.startsWith('rgba')) {
    return color
      .replace(' / ', '/')
      .replace(/\s/g, ',')
      .replace(/(\d+)%/, `${colorOpacity[opacity].decimal}`)
  }

  return `${color}${colorOpacity[opacity].hex}`
}
