import { createIcon } from '../lib/create-icon'

const SvgCustomizeIcon = createIcon(props => {
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
        d="M6.5 3.5a2 2 0 0 1-2-2h-1a2 2 0 0 1-2 2v1a2 2 0 0 1 2 2h1a2 2 0 0 1 2-2v-1ZM10 5.156l-.055.135A8.6 8.6 0 0 1 5.155 10 8.6 8.6 0 0 1 10 14.844l.056-.135A8.6 8.6 0 0 1 14.845 10 8.6 8.6 0 0 1 10 5.156Zm-5.168 3.68a7.4 7.4 0 0 1-2.83.564H2v1.2A7.4 7.4 0 0 1 9.4 18h1.2a7.4 7.4 0 0 1 7.4-7.4V9.4h-.002A7.4 7.4 0 0 1 10.6 2H9.4a7.4 7.4 0 0 1-4.568 6.837Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgCustomizeIcon
