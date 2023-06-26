import { createIcon } from '../lib/create-icon'

const SvgPinterestIcon = createIcon(props => {
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
      <g clipPath="url(#pinterest-icon_svg__a)">
        <path
          fill={props.color}
          d="M10 20c5.523 0 10-4.477 10-10S15.523 0 10 0 0 4.477 0 10s4.477 10 10 10Z"
        />
        <path
          fill="#fff"
          d="M10.757 13.179c-.71-.055-1.007-.406-1.563-.744-.305 1.603-.679 3.14-1.784 3.942-.342-2.422.5-4.242.892-6.173-.667-1.123.08-3.384 1.487-2.827 1.732.685-1.499 4.176.67 4.612 2.265.455 3.19-3.93 1.785-5.356-2.03-2.059-5.907-.047-5.43 2.901.116.72.861.94.298 1.934-1.3-.288-1.686-1.312-1.637-2.678.08-2.235 2.009-3.8 3.943-4.016 2.446-.274 4.741.898 5.058 3.198.356 2.597-1.104 5.409-3.72 5.207Z"
        />
      </g>
      <defs>
        <clipPath id="pinterest-icon_svg__a">
          <path fill="#fff" d="M0 0h20v20H0z" />
        </clipPath>
      </defs>
    </svg>
  )
})

export default SvgPinterestIcon