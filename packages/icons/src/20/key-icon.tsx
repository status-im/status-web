import type { SVGProps } from 'react'

const SvgKeyIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <g clipPath="url(#prefix__clip0_1728_850)">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M14.868 1.704a6.1 6.1 0 0 0-7.68 9.255l-2.62 4.545-.12.207.056.232.48 2.009.147.616.607-.18 1.983-.588.23-.067.12-.208 1-1.732.06-.105.015-.121.102-.827.662-.503.096-.073.06-.104.626-1.078a6.1 6.1 0 0 0 4.176-11.278Zm-4.006.477a4.9 4.9 0 1 1-.313 9.54l-.443-.12-.23.398-.787 1.355-.768.584-.202.153-.03.25-.119.958-.82 1.419-1.146.34-.277-1.162 2.721-4.72.23-.399-.325-.325a4.9 4.9 0 0 1 2.509-8.27Zm.676 3.49a.9.9 0 1 1 1.56.9.9.9 0 0 1-1.56-.9Zm1.83-1.369a2.1 2.1 0 1 0-2.1 3.638 2.1 2.1 0 0 0 2.1-3.638Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="prefix__clip0_1728_850">
        <rect width={20} height={20} fill="#fff" rx={6} />
      </clipPath>
    </defs>
  </svg>
)
export default SvgKeyIcon
