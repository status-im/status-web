/**
 * returns value for conic-gradient
 */
export const generateIdenticonRing = (colorHash: number[][]) => {
  const segments = colorHash.reduce((acc, segment) => (acc += segment[0]), 0)

  let prevAngle = 0
  const gradient = colorHash.reduce((acc, segment, index) => {
    const [length, colorIndex] = segment
    const color = COLORS[colorIndex]
    const nextAngle = Math.round(prevAngle + (length * 360) / segments)

    acc += `${color} ${prevAngle}deg ${nextAngle}deg`

    if (index !== colorHash.length - 1) {
      acc += `, `
    }

    prevAngle = nextAngle

    return acc
  }, '')

  return gradient
}

const COLORS = [
  '#000000',
  '#726F6F',
  '#C4C4C4',
  '#E7E7E7',
  '#FFFFFF',
  '#00FF00',
  '#009800',
  '#B8FFBB',
  '#FFC413',
  '#9F5947',
  '#FFFF00',
  '#A8AC00',
  '#FFFFB0',
  '#FF5733',
  '#FF0000',
  '#9A0000',
  '#FF9D9D',
  '#FF0099',
  '#C80078',
  '#FF00FF',
  '#900090',
  '#FFB0FF',
  '#9E00FF',
  '#0000FF',
  '#000086',
  '#9B81FF',
  '#3FAEF9',
  '#9A6600',
  '#00FFFF',
  '#008694',
  '#C2FFFF',
  '#00F0B6',
]
