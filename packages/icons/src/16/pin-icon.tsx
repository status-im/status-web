import type { SVGProps } from 'react'

const SvgPinIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    viewBox="0 0 16 16"
    aria-hidden={true}
    focusable={false}
    {...props}
  >
    <g clipPath="url(#prefix__clip0_1365_389)">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M6.657 5.955c.497-.86.897-1.491 1.25-1.942.355-.454.625-.677.846-.78.377-.176.821-.097 1.932.545 1.111.641 1.402.986 1.439 1.4.02.243-.037.59-.253 1.124-.214.53-.56 1.193-1.057 2.053l-.073.126-.007.145-.173 3.53L3.58 8.123l2.896-1.973.113-.077.069-.119Zm4.628-3.217c-1.054-.608-2.033-1.062-3.04-.593-.47.22-.88.613-1.284 1.129-.387.495-.8 1.147-1.274 1.962L2.114 7.67l-.789.538.827.478 3.744 2.161-1.886 3.114h1.5l1.438-2.506 3.864 2.23.852.492.048-.981.214-4.367c.467-.815.823-1.497 1.058-2.078.245-.607.38-1.16.335-1.677-.097-1.105-.98-1.727-2.034-2.336Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="prefix__clip0_1365_389">
        <path fill="#fff" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgPinIcon