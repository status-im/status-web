import { createIcon } from '../lib/create-icon'

const SvgForwardIcon = createIcon(props => {
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
        d="m12.951 13.395 3.5-4L16.798 9l-.345-.395-3.5-4-.904.79 2.63 3.005h-4.68c-2.55 0-4.297.505-5.348 1.857C3.637 11.56 3.4 13.509 3.399 16h1.2c0-2.508.264-4.061 1-5.007.698-.898 1.951-1.393 4.4-1.393h4.679l-2.63 3.005.903.79Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgForwardIcon
