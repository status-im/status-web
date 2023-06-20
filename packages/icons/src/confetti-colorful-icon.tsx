import { createIcon } from '../lib/create-icon'

const SvgConfettiColorfulIcon = createIcon(props => {
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
      <g clipPath="url(#confetti-colorful-icon_svg__a)">
        <path
          stroke={props.color}
          strokeWidth={1.2}
          d="M7.646 5.782c-.353.354-4.242 11.314-4.242 11.314s10.96-3.889 11.313-4.242c.354-.354.354-2.475-2.12-4.95C10.12 5.429 8 5.429 7.646 5.782Z"
        />
        <path
          stroke={props.color}
          strokeWidth={1.2}
          d="M7.646 5.782s-.353 2.475 2.122 4.95c2.475 2.475 4.95 2.122 4.95 2.122"
        />
        <path
          fill={props.color}
          fillRule="evenodd"
          d="M10.546 14.197 6.303 9.954l-.848.849 4.242 4.242.849-.848Zm-2.475 1.06L5.242 12.43l-.848.849 2.828 2.828.849-.848Z"
          clipRule="evenodd"
        />
        <path fill="#EC266C" d="M17.5 9.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
        <path
          fill="#FF7D46"
          d="M10.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
        />
        <path fill="#F6B03C" d="M18.5 2.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
        <path fill="#1992D7" d="M15 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
        <path fill="#7140FD" d="M14.5 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
        <path fill="#F66F8F" d="M20 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
      </g>
      <defs>
        <clipPath id="confetti-colorful-icon_svg__a">
          <path fill="#fff" d="M0 0h20v20H0z" />
        </clipPath>
      </defs>
    </svg>
  )
})

export default SvgConfettiColorfulIcon
