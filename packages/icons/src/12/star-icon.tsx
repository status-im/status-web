import type { SVGProps } from 'react'

const SvgStarIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <g clipPath="url(#prefix__clip0_3507_951)">
      <path
        stroke="currentColor"
        strokeWidth={1.1}
        d="M6 1c.333 0 1.667 3.323 1.667 3.323s3.333 0 3.333.415c0 .416-2.917 2.492-2.917 2.492s1.584 3.406 1.25 3.739C9 11.3 6 8.892 6 8.892S3 11.3 2.667 10.969c-.334-.333 1.25-3.739 1.25-3.739S1 5.154 1 4.738c0-.415 3.333-.415 3.333-.415S5.667 1 6 1Z"
      />
    </g>
    <defs>
      <clipPath id="prefix__clip0_3507_951">
        <path fill="#fff" d="M0 0h12v12H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgStarIcon
