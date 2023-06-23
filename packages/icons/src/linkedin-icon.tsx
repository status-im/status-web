import { createIcon } from '../lib/create-icon'

const SvgLinkedinIcon = createIcon(props => {
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
      <g clipPath="url(#linkedin-icon_svg__a)">
        <path
          fill={props.color}
          d="M10 0c8.667 0 10 1.333 10 10s-1.333 10-10 10S0 18.667 0 10 1.333 0 10 0Z"
        />
        <path
          fill="#fff"
          d="M5.752 8.526h1.813v5.837H5.752V8.526Zm.924-2.901a1.053 1.053 0 0 1 1.032 1.252 1.049 1.049 0 0 1-.823.826 1.053 1.053 0 0 1-1.26-1.023 1.047 1.047 0 0 1 1.051-1.055Zm2.049 2.9h1.746v.797a1.908 1.908 0 0 1 1.723-.941c1.812 0 2.181 1.206 2.181 2.78v3.202h-1.813V11.54c0-.676 0-1.55-.942-1.55-.943 0-1.088.736-1.088 1.495v2.889H8.719l.006-5.85Z"
        />
      </g>
      <defs>
        <clipPath id="linkedin-icon_svg__a">
          <path fill="#fff" d="M0 0h20v20H0z" />
        </clipPath>
      </defs>
    </svg>
  )
})

export default SvgLinkedinIcon
