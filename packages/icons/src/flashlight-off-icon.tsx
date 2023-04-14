import { createIcon } from '../lib/create-icon'

const SvgFlashlightOffIcon = createIcon(props => {
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
        d="M11.6 1.903V7.9h5.722l-.87.995-7 8L8.4 18.097V12.1H2.678l.87-.995 7-8L11.6 1.903ZM5.322 10.9H9.6v4.003L14.678 9.1H10.4V5.097L5.322 10.9Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgFlashlightOffIcon
