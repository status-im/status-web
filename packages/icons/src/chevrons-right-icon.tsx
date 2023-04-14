import { createIcon } from '../lib/create-icon'

const SvgChevronsRightIcon = createIcon(props => {
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
        d="m10.675 9.576-4.5-4.5-.85.848L9.403 10l-4.076 4.076.848.848 4.5-4.5L11.1 10l-.425-.424Zm4 0-4.5-4.5-.85.848L13.403 10l-4.076 4.076.848.848 4.5-4.5L15.1 10l-.425-.424Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgChevronsRightIcon
