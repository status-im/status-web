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
        d="M3.1 10a6.9 6.9 0 0 1 11.336-5.285l-9.721 9.721A6.872 6.872 0 0 1 3.1 10Zm2.463 5.285a6.9 6.9 0 0 0 9.721-9.721l-9.72 9.72ZM10 1.9a8.1 8.1 0 1 0 0 16.2 8.1 8.1 0 0 0 0-16.2Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgBlockIcon
