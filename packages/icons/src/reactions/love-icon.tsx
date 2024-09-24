import type { SVGProps } from 'react'

const SvgLoveIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    viewBox="0 0 12 12"
    aria-hidden={true}
    focusable={false}
    {...props}
  >
    <path
      fill="#E45852"
      d="M.375 4.125C.375 7.5 4.343 11.25 6 11.25s5.625-3.75 5.625-7.125c0-1.657-1.125-3-2.625-3-1.318 0-2.438.594-2.84 1.875-.08.188-.12.188-.16.188-.04 0-.08 0-.16-.188C5.439 1.719 4.319 1.125 3 1.125c-1.5 0-2.625 1.343-2.625 3Z"
    />
    <path
      fill="url(#prefix__paint0_radial_2438_891)"
      d="M.375 4.125C.375 7.5 4.343 11.25 6 11.25s5.625-3.75 5.625-7.125c0-1.657-1.125-3-2.625-3-1.318 0-2.438.594-2.84 1.875-.08.188-.12.188-.16.188-.04 0-.08 0-.16-.188C5.439 1.719 4.319 1.125 3 1.125c-1.5 0-2.625 1.343-2.625 3Z"
    />
    <defs>
      <radialGradient
        id="prefix__paint0_radial_2438_891"
        cx={0}
        cy={0}
        r={1}
        gradientTransform="matrix(-.52735 7.74098 -7.4041 -.5044 6 3.957)"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F05D56" />
        <stop offset={1} stopColor="#D15954" />
      </radialGradient>
    </defs>
  </svg>
)
export default SvgLoveIcon
