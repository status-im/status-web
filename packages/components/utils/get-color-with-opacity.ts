function getColorWithOpacity(color: string, opacity: number): string {
  // Parse the color string based on the format
  let match
  let red, green, blue

  if (color.startsWith('#')) {
    // Hexadecimal format (#RRGGBB or #RGB)
    match = color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
    if (!match) {
      throw new Error('Invalid color format')
    }

    red = parseInt(match[1], 16)
    green = parseInt(match[2], 16)
    blue = parseInt(match[3], 16)
  } else if (color.startsWith('rgb(')) {
    // RGB format (rgb(R, G, B))
    match = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
    if (!match) {
      throw new Error('Invalid color format')
    }

    red = parseInt(match[1], 10)
    green = parseInt(match[2], 10)
    blue = parseInt(match[3], 10)
  } else if (color.startsWith('hsl(')) {
    // HSL format (hsl(H, S, L))
    match = color.match(/^hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)$/)
    if (!match) {
      throw new Error('Invalid color format')
    }

    const h = parseInt(match[1], 10)
    const s = parseInt(match[2], 10)
    const l = parseInt(match[3], 10)

    // Convert HSL to RGB
    const rgb = hslToRgb(h, s, l)
    red = rgb.r
    green = rgb.g
    blue = rgb.b
  } else if (color.startsWith('hsla(')) {
    // HSLA format (hsla(H, S, L, A))
    match = color.match(/^hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)$/)
    if (!match) {
      throw new Error('Invalid color format')
    }

    const h = parseInt(match[1], 10)
    const s = parseInt(match[2], 10)
    const l = parseInt(match[3], 10)

    // Convert HSL to RGB
    const rgb = hslToRgb(h, s, l)
    red = rgb.r
    green = rgb.g
    blue = rgb.b
  } else {
    throw new Error('Invalid color format')
  }

  // Ensure the opacity value is within the valid range of 0 to 1
  const clampedOpacity = Math.max(0, Math.min(1, opacity))

  // Calculate the new RGBA values based on the original color and opacity
  const newRed = Math.round((1 - clampedOpacity) * 255 + clampedOpacity * red)
  const newGreen = Math.round(
    (1 - clampedOpacity) * 255 + clampedOpacity * green
  )
  const newBlue = Math.round((1 - clampedOpacity) * 255 + clampedOpacity * blue)

  // Convert the new RGB values back to the appropriate color format
  let newColor
  if (color.startsWith('#')) {
    // Hexadecimal format
    newColor = `#${newRed.toString(16).padStart(2, '0')}${newGreen
      .toString(16)
      .padStart(2, '0')}${newBlue.toString(16).padStart(2, '0')}`
  } else if (color.startsWith('rgb(')) {
    // RGB format
    newColor = `rgb(${newRed}, ${newGreen}, ${newBlue})`
  } else if (color.startsWith('rgba(')) {
    // RGBA format
    newColor = `rgba(${newRed}, ${newGreen}, ${newBlue}, ${1})`
  } else {
    // HSL and HSLA format
    const hsl = rgbToHsl(newRed, newGreen, newBlue)
    const h = hsl.h
    const s = hsl.s
    const l = hsl.l

    if (color.startsWith('hsl(')) {
      newColor = `hsl(${h}, ${s}%, ${l}%)`
    } else {
      newColor = `hsla(${h}, ${s}%, ${l}%, ${1})`
    }
  }

  return newColor
}

// Utility function to convert RGB to HSL
function rgbToHsl(r: number, g: number, b: number) {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0,
    s

  const l = (max + min) / 2

  if (max === min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h /= 6
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

// Utility function to convert HSL to RGB
function hslToRgb(h: number, s: number, l: number) {
  h /= 360
  s /= 100
  l /= 100

  let r, g, b

  if (s === 0) {
    r = g = b = l // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }
}

export { getColorWithOpacity }
