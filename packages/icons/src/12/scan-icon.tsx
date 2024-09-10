import type { SVGProps } from 'react'

const SvgScanIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    viewBox="0 0 12 12"
    {...props}
  >
    <g clipPath="url(#prefix__clip0_3659_954)">
      <path
        fill="#09101C"
        fillRule="evenodd"
        d="M1.611 1.611C2.331.891 3.38.59 4.75.49v1.104c-1.21.096-1.92.354-2.36.795-.442.441-.7 1.15-.796 2.361H.49c.099-1.37.402-2.419 1.121-3.139ZM7.25.49v1.104c1.21.096 1.92.354 2.361.795.441.441.7 1.15.796 2.361h1.103c-.098-1.37-.401-2.42-1.12-3.139C9.67.891 8.62.59 7.25.49Zm2.361 9.121c-.44.441-1.15.7-2.361.796v1.104c1.37-.1 2.42-.402 3.14-1.122.719-.72 1.022-1.768 1.12-3.139h-1.103c-.097 1.21-.355 1.92-.796 2.361Zm-7.222 0c-.44-.44-.699-1.15-.795-2.361H.49c.099 1.37.401 2.42 1.121 3.14.72.719 1.769 1.022 3.139 1.12v-1.103c-1.21-.097-1.92-.355-2.36-.796ZM4 6.55h4v-1.1H4v1.1Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="prefix__clip0_3659_954">
        <path fill="#fff" d="M0 0h12v12H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgScanIcon
