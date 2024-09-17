import type { SVGProps } from 'react'

const SvgTokenIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <g clipPath="url(#prefix__clip0_3917_1002)">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M2.1 8a5.9 5.9 0 1 1 11.8 0A5.9 5.9 0 0 1 2.1 8ZM8 .9a7.1 7.1 0 1 0 0 14.2A7.1 7.1 0 0 0 8 .9Zm-.69 4.866a1.516 1.516 0 0 1 1.038-.125c.347.083.684.292.959.622l.922-.768a3.004 3.004 0 0 0-1.602-1.021L8.6 4.468V3.5H7.4v.968a2.799 2.799 0 0 0-.624.223 3.26 3.26 0 0 0-1.379 1.35A4.041 4.041 0 0 0 4.9 8c0 .69.17 1.371.497 1.959a3.26 3.26 0 0 0 1.38 1.35c.2.1.41.175.623.223v.968h1.2v-.968l.027-.006a3.004 3.004 0 0 0 1.602-1.02l-.922-.769c-.275.33-.612.539-.959.622a1.516 1.516 0 0 1-1.038-.125 2.063 2.063 0 0 1-.864-.86A2.842 2.842 0 0 1 6.1 8c0-.497.123-.975.346-1.375.222-.4.528-.692.864-.86Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="prefix__clip0_3917_1002">
        <path fill="#fff" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgTokenIcon