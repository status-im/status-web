import { createIcon } from '../lib/create-icon'

const SvgOnlineLeftIcon = createIcon(props => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width={props.width}
      height={props.height}
      fill="none"
      viewBox="0 0 14 20"
      focusable={false}
      aria-hidden={true}
    >
      <circle cx={4} cy={10} r={4} fill="#23ADA0" />
    </svg>
  )
})

export default SvgOnlineLeftIcon
