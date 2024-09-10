import type { SVGProps } from 'react'

const SvgProfileIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <g clipPath="url(#prefix__clip0_3221_3784)">
      <path
        fill="#09101C"
        fillRule="evenodd"
        d="M8 .9a7.1 7.1 0 1 0 0 14.2A7.1 7.1 0 0 0 8 .9ZM2.1 8a5.9 5.9 0 1 1 10.366 3.856 4.257 4.257 0 0 0-.196-.183C11.103 10.653 9.545 10.4 8 10.4c-1.545 0-3.104.253-4.27 1.273-.067.059-.132.12-.196.183A5.877 5.877 0 0 1 2.1 8Zm2.307 4.68A5.874 5.874 0 0 0 8 13.9a5.874 5.874 0 0 0 3.593-1.22 3.116 3.116 0 0 0-.113-.104c-.834-.729-2.025-.976-3.48-.976s-2.647.247-3.48.976a3.133 3.133 0 0 0-.113.104ZM1.9 17c0-.35.012-.683.035-1h1.203c-.01.13-.019.262-.025.4h9.774c-.007-.137-.015-.27-.026-.4h1.204c.023.317.035.65.035 1v.6H1.9V17ZM6.1 6.5a1.9 1.9 0 1 1 3.8 0 1.9 1.9 0 0 1-3.8 0ZM8 3.4a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 0 0 0-6.2Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="prefix__clip0_3221_3784">
        <path fill="#fff" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgProfileIcon
