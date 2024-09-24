import type { SVGProps } from 'react'

const SvgCustomizeIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <g clipPath="url(#prefix__clip0_3221_4343)">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M2.146 2.146c.101-.1.316-.196.854-.196v-.9c-.538 0-.753-.095-.854-.196C2.046.753 1.95.538 1.95 0h-.9c0 .538-.095.753-.196.854-.101.1-.316.196-.854.196v.9c.538 0 .753.095.854.196.1.101.196.316.196.854h.9c0-.538.095-.753.196-.854Zm2.368 2.368A7.377 7.377 0 0 1 2.399 6c.782.36 1.504.875 2.115 1.486A7.377 7.377 0 0 1 6 9.601a7.377 7.377 0 0 1 1.486-2.115A7.377 7.377 0 0 1 9.601 6a7.377 7.377 0 0 1-2.115-1.486A7.377 7.377 0 0 1 6 2.399a7.377 7.377 0 0 1-1.486 2.115ZM12 6.55v-1.1c-1.321 0-2.688-.666-3.736-1.714S6.55 1.321 6.55 0h-1.1c0 1.321-.666 2.688-1.714 3.736S1.321 5.45 0 5.45v1.1c1.321 0 2.688.666 3.736 1.714S5.45 10.679 5.45 12h1.1c0-1.321.666-2.688 1.714-3.736S10.679 6.55 12 6.55Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="prefix__clip0_3221_4343">
        <path fill="#fff" d="M0 0h12v12H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgCustomizeIcon
