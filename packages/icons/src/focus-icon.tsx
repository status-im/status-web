import { createIcon } from '../lib/create-icon'

const SvgFocusIcon = createIcon(props => {
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
        d="M6.55 4.023A6.868 6.868 0 0 1 10 3.1a6.908 6.908 0 0 1 5.976 3.45 6.9 6.9 0 0 1-2.525 9.426 6.87 6.87 0 0 1-3.45.924 6.869 6.869 0 0 1-3.451-.923v-.001a6.9 6.9 0 0 1 0-11.952Zm8.654 12.185A8.1 8.1 0 1 1 4.797 3.792a8.1 8.1 0 0 1 10.407 12.416ZM10 6.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8ZM5.4 10a4.6 4.6 0 1 1 9.2 0 4.6 4.6 0 0 1-9.2 0Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgFocusIcon
