import { createIcon } from '../lib/create-icon'

const SvgPauseIcon = createIcon(props => {
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
        d="M15.839 4.276c.661.493.661 1.873.661 5.724 0 6 0 6-2.5 6s-2.5 0-2.5-6c0-3.851 0-5.23.661-5.724C12.531 4 13.105 4 14 4s1.47 0 1.839.276Zm-8 0C8.5 4.769 8.5 6.149 8.5 10c0 6 0 6-2.5 6s-2.5 0-2.5-6c0-3.851 0-5.23.661-5.724C4.531 4 5.105 4 6 4s1.47 0 1.839.276Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgPauseIcon
