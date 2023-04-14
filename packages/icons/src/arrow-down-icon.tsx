import { createIcon } from '../lib/create-icon'

const SvgArrowDownIcon = createIcon(props => {
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
        d="m10.6 15.144 4.496-4.088.808.888-5.5 5-.404.367-.404-.367-5.5-5 .808-.888L9.4 15.144V4h1.2v11.144Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgArrowDownIcon
