import type { SVGProps } from 'react'

const SvgLaughIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    viewBox="0 0 12 12"
    {...props}
  >
    <circle cx={6} cy={6} r={6} fill="#FFD764" />
    <circle cx={6} cy={6} r={6} fill="url(#prefix__paint0_radial_2438_895)" />
    <path
      fill="#772622"
      d="M9.375 7.313c0 1.656-1.875 2.812-3.375 2.812S2.625 8.969 2.625 7.312c0-.75 1.688-1.125 3.375-1.125 1.688 0 3.375.375 3.375 1.125Z"
    />
    <path
      fill="#fff"
      d="M8.01 7.03c-.33-.11-1-.28-2.01-.28-1.01 0-1.68.17-2.01.28-.135.047-.188.199-.124.327a.258.258 0 0 0 .231.143h3.806a.258.258 0 0 0 .231-.143c.064-.128.01-.28-.125-.326Z"
    />
    <path
      fill="#E45852"
      d="M7.104 8.914a.223.223 0 0 1-.017.402A2.552 2.552 0 0 1 6 9.562c-.38 0-.752-.088-1.087-.246a.223.223 0 0 1-.017-.402A2.24 2.24 0 0 1 6 8.625c.401 0 .778.105 1.104.29Z"
    />
    <path
      fill="#424242"
      fillRule="evenodd"
      d="M3.076 3.493a.328.328 0 0 1 .462-.042l1.125.938a.328.328 0 0 1-.21.58c-.52 0-1.278.168-1.7.433a.328.328 0 1 1-.349-.557c.29-.18.668-.317 1.05-.407.078-.018.103-.117.042-.168l-.378-.315a.328.328 0 0 1-.042-.462ZM8.924 3.493a.328.328 0 0 0-.462-.042l-1.125.938a.328.328 0 0 0 .21.58c.52 0 1.278.168 1.7.433a.328.328 0 1 0 .349-.557c-.29-.18-.668-.317-1.05-.407-.078-.018-.103-.117-.042-.168l.378-.315a.328.328 0 0 0 .042-.462Z"
      clipRule="evenodd"
    />
    <defs>
      <radialGradient
        id="prefix__paint0_radial_2438_895"
        cx={0}
        cy={0}
        r={1}
        gradientTransform="rotate(124.563 3.39 3.337) scale(10.2458 13.3012)"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFD764" />
        <stop offset={1} stopColor="#FFB746" />
      </radialGradient>
    </defs>
  </svg>
)
export default SvgLaughIcon
