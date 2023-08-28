import { createIcon } from '../lib/create-icon'

const SvgNotificationBadgeIcon = createIcon(props => {
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
      <circle cx={10} cy={10} r={4} fill="#2A4AF5" />
    </svg>
  )
})

export default SvgNotificationBadgeIcon
