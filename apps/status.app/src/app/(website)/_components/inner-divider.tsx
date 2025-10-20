type Props = {
  variant?: 'default' | 'smaller'
}

const InnerDivider = (props: Props) => {
  const { variant = 'default' } = props

  const maskBase64 = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" height="1" width="100%" fill="none">
      <line
        x1="0%"
        y1="0"
        x2="100%"
        y2="0"
        stroke="#000"
        stroke-dasharray="2 2"
      />
    </svg>
  `)}`

  const firstPercentageValue = variant === 'smaller' ? '33.59%' : '53.59%'
  const secondPercentageValue = variant === 'smaller' ? '60%' : '100%'

  return (
    <div
      style={{
        width: '100%',
        height: '1px',
        backgroundImage: `linear-gradient(to right, #D9D9D9 ${firstPercentageValue}, rgba(217, 217, 217, 0.00) ${secondPercentageValue})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: '100% 1px',
        position: 'relative',
        WebkitMaskImage: `url(${maskBase64})`,
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        WebkitMaskSize: '100% 1px',
      }}
    />
  )
}

export { InnerDivider }
