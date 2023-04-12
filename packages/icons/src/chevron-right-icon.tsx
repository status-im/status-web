import { createIcon } from '../lib/create-icon'

const SvgChevronRightIcon = createIcon(props => {
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
        stroke={props.color}
        strokeWidth={1.2}
        d="m7.75 14.5 4.5-4.5-4.5-4.5"
      />
    </svg>
  )
})

export default SvgChevronRightIcon
