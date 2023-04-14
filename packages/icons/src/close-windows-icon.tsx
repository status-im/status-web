import { createIcon } from '../lib/create-icon'

const SvgCloseWindowsIcon = createIcon(props => {
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
        d="M10 9.151 5.424 4.576l-.848.848L9.152 10l-4.576 4.576.848.848L10 10.85l4.576 4.575.848-.848L10.85 10l4.575-4.576-.848-.848L10 9.15Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgCloseWindowsIcon
