import type { SVGProps } from 'react'

const SvgKeyIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    viewBox="0 0 12 12"
    {...props}
  >
    <g clipPath="url(#prefix__clip0_7752_19)">
      <path
        fill="#09101C"
        fillRule="evenodd"
        d="M9.248.653a4.123 4.123 0 0 0-5.264 6.168L2.338 9.677l-.11.19.051.212.312 1.306.135.564.556-.165 1.288-.381.21-.063.11-.19.65-1.125.056-.097.014-.11.058-.47.376-.286.088-.067.055-.095.35-.604A4.123 4.123 0 0 0 9.249.653Zm-2.651.606a3.023 3.023 0 1 1-.193 5.885l-.407-.109-.211.364-.495.853-.473.36-.185.14-.028.23-.073.59-.484.838-.522.155-.126-.528 1.736-3.012.21-.365-.297-.298a3.023 3.023 0 0 1 1.548-5.103ZM7.1 3.424a.475.475 0 1 1 .822.475.475.475 0 0 1-.822-.475Zm1.148-1.04a1.475 1.475 0 1 0-1.474 2.554 1.475 1.475 0 0 0 1.474-2.554Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="prefix__clip0_7752_19">
        <path fill="#fff" d="M0 0h12v12H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgKeyIcon
