import type { SVGProps } from 'react'

const SvgWarningIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <g clipPath="url(#prefix__clip0_3221_3661)">
      <path
        fill="#09101C"
        fillRule="evenodd"
        d="M8.23.946 8 .85l-.23.095-4.596 1.903-.23.096-.095.23L.946 7.77.85 8l.095.23 1.903 4.596.096.23.23.095 4.595 1.903.23.095.23-.095 4.596-1.904.23-.095.095-.23 1.903-4.595.095-.23-.095-.23-1.904-4.596-.095-.23-.23-.095L8.23.946ZM2.15 8l1.713-4.137L8 2.149l4.137 1.714L13.851 8l-1.714 4.137L8 13.851l-4.137-1.714L2.149 8Zm6.4 1 .2-5h-1.5l.2 5h1.1Zm.2 2.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="prefix__clip0_3221_3661">
        <path fill="#fff" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgWarningIcon
