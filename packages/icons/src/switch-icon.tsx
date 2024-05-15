import { createIcon } from '../lib/create-icon'

const SvgSwitchIcon = createIcon(props => {
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
      <path
        fill={props.color}
        fillRule="evenodd"
        d="m13.452 10.895 3.5-4 .346-.395-.346-.395-3.5-4-.903.79 2.63 3.005H4.5v1.2h10.678l-2.63 3.005.904.79Zm-6.903-1.79-3.5 4-.346.395.345.395 3.5 4 .904-.79-2.63-3.005H15.5v-1.2H4.822l2.63-3.005-.903-.79Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgSwitchIcon
