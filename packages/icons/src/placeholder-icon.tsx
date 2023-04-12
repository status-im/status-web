import { createIcon } from '../lib/create-icon'

const SvgPlaceholderIcon = createIcon(props => {
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
        d="M10 3.1a6.872 6.872 0 0 0-4.398 1.583L10 9.08l4.398-4.398A6.872 6.872 0 0 0 10 3.1Zm5.317 2.502L10.919 10l4.398 4.398A6.872 6.872 0 0 0 16.9 10a6.872 6.872 0 0 0-1.583-4.398ZM9.081 10 4.683 5.602A6.872 6.872 0 0 0 3.1 10c0 1.671.594 3.204 1.583 4.398L9.08 10Zm-3.479 5.317L10 10.919l4.398 4.398A6.872 6.872 0 0 1 10 16.9a6.872 6.872 0 0 1-4.398-1.583ZM1.9 10a8.1 8.1 0 1 1 16.2 0 8.1 8.1 0 0 1-16.2 0Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgPlaceholderIcon
