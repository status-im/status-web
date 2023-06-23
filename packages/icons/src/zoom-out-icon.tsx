import { createIcon } from '../lib/create-icon'

const SvgZoomOutIcon = createIcon(props => {
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
        d="M9 3.1a5.9 5.9 0 1 0 0 11.8A5.9 5.9 0 0 0 9 3.1ZM1.9 9a7.1 7.1 0 1 1 12.527 4.578l3.497 3.498-.848.848-3.498-3.497A7.1 7.1 0 0 1 1.9 9Zm4.6.6h5V8.4h-5v1.2Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgZoomOutIcon
