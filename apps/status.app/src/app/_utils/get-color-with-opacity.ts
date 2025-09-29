/**
 * Gets the color with opacity based on the original color and opacity value
 * @param color - the original color
 * @param opacity - the opacity value
 * @returns the color with opacity
 **/

function getColorWithOpacity(color?: string, opacity?: number): string {
  // If the color is not defined, return transparent
  if (!color) return 'transparent'

  // If the opacity is not defined, return the original color
  if (!opacity) return color
  // Ensure the opacity value is within the valid range of 0 to 1
  const clampedOpacity = Math.max(0, Math.min(1, opacity)) * 100

  // Construct the color string with opacity using CSS color-mix function
  const newColor = `color-mix(in srgb, ${color} ${clampedOpacity}%, transparent)`

  return newColor
}

export { getColorWithOpacity }
