import type { SVGProps } from 'react'

const SvgProfileIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <g clipPath="url(#prefix__clip0_394_102)">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M3.6 10a6.4 6.4 0 1 1 11.24 4.188 4.914 4.914 0 0 0-.303-.312C13.242 12.654 11.548 12.4 10 12.4s-3.243.254-4.537 1.476a4.91 4.91 0 0 0-.302.312A6.375 6.375 0 0 1 3.6 10Zm2.429 5.019A6.373 6.373 0 0 0 10 16.4c1.5 0 2.88-.516 3.972-1.38a3.692 3.692 0 0 0-.259-.271C12.757 13.846 11.452 13.6 10 13.6s-2.758.246-3.713 1.149a3.697 3.697 0 0 0-.258.27ZM10 2.4a7.6 7.6 0 1 0 0 15.2 7.6 7.6 0 0 0 0-15.2ZM3.4 20.5c0-.17.002-.337.006-.5h13.188c.004.163.006.33.006.5v.6H3.4v-.6ZM8.1 8a1.9 1.9 0 1 1 3.8 0 1.9 1.9 0 0 1-3.8 0ZM10 4.9a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 0 0 0-6.2Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="prefix__clip0_394_102">
        <path fill="#fff" d="M0 0h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgProfileIcon
