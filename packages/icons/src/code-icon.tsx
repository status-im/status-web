import { createIcon } from '../lib/create-icon'

const SvgCodeIcon = createIcon(props => {
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
        d="m8.405 17.42 2-15 1.19.16-2 15-1.19-.16ZM6.576 5.077l-4.5 4.5L1.65 10l.425.424 4.5 4.5.848-.848L3.348 10l4.076-4.076-.848-.848Zm11.349 4.5-4.5-4.5-.849.848L16.652 10l-4.076 4.076.848.848 4.5-4.5.425-.424-.424-.424Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgCodeIcon
