import { createIcon } from '../lib/create-icon'

const SvgSeedIcon = createIcon(props => {
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
        d="M9 3.4H2.5v1.2H9V3.4Zm8.5 0h-6v1.2h6V3.4Zm-5.5 4H2.5v1.2H12V7.4Zm5.5 0h-3v1.2h3V7.4Zm-15 4H6v1.2H2.5v-1.2Zm6 0h9v1.2h-9v-1.2Zm.5 4H2.5v1.2H9v-1.2Zm8.5 1.2v-1.2h-6v1.2h6Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgSeedIcon
