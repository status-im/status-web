import { createIcon } from '../lib/create-icon'

const SvgMinimizeMacOsIcon = createIcon(props => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width={props.width}
      height={props.height}
      fill="none"
      viewBox="0 0 20 20"
      focusable={false}
      aria-hidden={true}
    >
      <circle cx={10} cy={10} r={6} fill="#F6B03C" />
      <circle
        cx={10}
        cy={10}
        r={5.4}
        stroke="#1B273D"
        strokeOpacity={0.1}
        strokeWidth={1.2}
      />
    </svg>
  )
})

export default SvgMinimizeMacOsIcon
