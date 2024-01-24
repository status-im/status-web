import { createIcon } from '../lib/create-icon'

const SvgBlockIcon = createIcon(props => {
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
        d="M3.6 10a6.4 6.4 0 0 1 10.48-4.93l-9.01 9.011A6.374 6.374 0 0 1 3.6 10Zm2.318 4.93a6.4 6.4 0 0 0 9.011-9.011l-9.01 9.01ZM10 2.4a7.6 7.6 0 1 0 0 15.2 7.6 7.6 0 0 0 0-15.2Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgBlockIcon
