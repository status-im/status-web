import type { SVGProps } from 'react'

const SvgDisconnectIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 20 20"
    aria-hidden={true}
    focusable={false}
    {...props}
  >
    <g clipPath="url(#prefix__clip0_4202_1053)">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M15.374 4.626a3.6 3.6 0 0 0-5.091 0L8.869 6.04l.848.849 1.415-1.414a2.4 2.4 0 1 1 3.394 3.394l-1.415 1.414.849.848 1.414-1.414a3.6 3.6 0 0 0 0-5.091Zm-9.9 6.505L6.89 9.717 6.04 8.87l-1.414 1.414a3.6 3.6 0 0 0 5.091 5.091l1.415-1.414-.85-.849-1.413 1.414a2.4 2.4 0 1 1-3.394-3.394Zm-.353-6.859-.848.849 10.606 10.607.849-.849L5.12 4.272Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="prefix__clip0_4202_1053">
        <path fill="#fff" d="M0 0h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgDisconnectIcon
