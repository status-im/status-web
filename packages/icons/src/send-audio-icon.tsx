import { createIcon } from '../lib/create-icon'

const SvgSendAudioIcon = createIcon(props => {
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
      <g clipPath="url(#send-audio-icon_svg__a)">
        <circle cx={10} cy={10} r={10} fill="#2A4AF5" />
        <path
          fill="#fff"
          fillRule="evenodd"
          d="m10.095 5.614-.252-.23-.253.23-3.436 3.127.504.555 2.81-2.556v6.968h.75V6.74l2.809 2.556.504-.555-3.436-3.127Z"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <clipPath id="send-audio-icon_svg__a">
          <path fill="#fff" d="M0 0h20v20H0z" />
        </clipPath>
      </defs>
    </svg>
  )
})

export default SvgSendAudioIcon
