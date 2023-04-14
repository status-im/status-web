import { createIcon } from '../lib/create-icon'

const SvgMentionIcon = createIcon(props => {
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
        d="M12.096 2.176a8.1 8.1 0 1 0 1.954 14.839l-.6-1.04A6.9 6.9 0 1 1 16.9 10v.25a1.65 1.65 0 1 1-3.3 0V6.5h-1.2v.817a3.6 3.6 0 1 0 .597 4.679A2.85 2.85 0 0 0 18.1 10.25v-.251a8.1 8.1 0 0 0-6.004-7.824ZM10 7.6a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgMentionIcon
