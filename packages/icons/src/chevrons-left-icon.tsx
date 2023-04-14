import { createIcon } from '../lib/create-icon'

const SvgChevronsLeftIcon = createIcon(props => {
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
        d="m5.326 9.576 4.5-4.5.848.848L6.599 10l4.076 4.076-.848.848-4.5-4.5L4.9 10l.425-.424Zm4 0 4.5-4.5.848.848L10.6 10l4.075 4.076-.848.848-4.5-4.5L8.9 10l.425-.424Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgChevronsLeftIcon
