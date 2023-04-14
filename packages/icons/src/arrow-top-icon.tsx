import { createIcon } from '../lib/create-icon'

const SvgArrowTopIcon = createIcon(props => {
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
        d="M10.404 3.056 10 2.69l-.404.367-5.5 5 .808.888L9.4 4.856V16h1.2V4.856l4.496 4.088.808-.888-5.5-5Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgArrowTopIcon
