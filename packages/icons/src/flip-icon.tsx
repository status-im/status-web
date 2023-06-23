import { createIcon } from '../lib/create-icon'

const SvgFlipIcon = createIcon(props => {
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
        d="M6.417 2.735a8.1 8.1 0 0 1 11.407 5.169l-1.16.31A6.9 6.9 0 0 0 4.45 5.9H7v1.2H2.9V3h1.2v1.45a8.1 8.1 0 0 1 2.317-1.715ZM10 8.1a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8ZM6.9 10a3.1 3.1 0 1 1 6.2 0 3.1 3.1 0 0 1-6.2 0Zm-4.724 2.096A8.1 8.1 0 0 0 15.9 15.55V17h1.2v-4.1H13v1.2h2.55a6.901 6.901 0 0 1-12.215-2.314l-1.16.31Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgFlipIcon
