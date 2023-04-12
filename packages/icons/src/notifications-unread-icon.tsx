import { createIcon } from '../lib/create-icon'

const SvgNotificationsUnreadIcon = createIcon(props => {
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
        d="M9.956 2.4c-1.003.007-2.19.249-3.168 1.202-.986.96-1.668 2.55-1.844 5.055-.059.845-.085 1.202-.125 1.402-.04.2-.114.427-.3.983L3.43 14.31l-.263.79H6.45a3.6 3.6 0 0 0 7.1 0h3.282l-.263-.79-1.09-3.268a55.905 55.905 0 0 1-.04-.122 5.539 5.539 0 0 1-1.24.072c.037.115.08.241.127.383l.015.046.826 2.479H4.832l.826-2.479.016-.046c.165-.495.266-.798.322-1.083.057-.285.088-.726.14-1.47l.005-.08c.164-2.344.788-3.603 1.484-4.28.502-.489 1.09-.723 1.694-.814A5.54 5.54 0 0 1 9.956 2.4Zm-2.28 12.7a2.4 2.4 0 0 0 4.647 0H7.676Z"
        clipRule="evenodd"
      />
      <circle cx={14.5} cy={5.5} r={4} fill="#2A4AF5" />
    </svg>
  )
})

export default SvgNotificationsUnreadIcon
