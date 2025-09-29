export function rgbToHex(color: { r: number; g: number; b: number }): string {
  // Convert decimal values to hexadecimal
  const red = color.r.toString(16).padStart(2, '0')
  const green = color.g.toString(16).padStart(2, '0')
  const blue = color.b.toString(16).padStart(2, '0')

  // Concatenate the hexadecimal values
  const hexValue = `#${red}${green}${blue}`

  return hexValue
}
