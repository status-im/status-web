import type { SVGProps } from 'react'

const SvgSpainIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <path
      fill="#C60A1D"
      d="M20 15a2.222 2.222 0 0 1-2.222 2.222H2.222A2.222 2.222 0 0 1 0 15V5c0-1.227.995-2.222 2.222-2.222h15.556C19.005 2.778 20 3.773 20 5v10Z"
    />
    <path fill="#FFC400" d="M0 6.667h20v6.666H0V6.667Z" />
    <path
      fill="#EA596E"
      d="M5 9.444v1.667a1.667 1.667 0 1 0 3.333 0V9.444H5Z"
    />
    <path fill="#F4A2B2" d="M6.667 8.889h1.666v1.667H6.667V8.889Z" />
    <path fill="#DD2E44" d="M5 8.889h1.667v1.667H5V8.889Z" />
    <path
      fill="#EA596E"
      d="M6.667 8.889c.92 0 1.666-.373 1.666-.833 0-.46-.746-.834-1.666-.834-.92 0-1.667.373-1.667.833 0 .46.746.834 1.667.834Z"
    />
    <path
      fill="#FFAC33"
      d="M6.667 8.056c.92 0 1.666-.187 1.666-.417 0-.23-.746-.417-1.666-.417-.92 0-1.667.187-1.667.417 0 .23.746.417 1.667.417Z"
    />
    <path
      fill="#99AAB5"
      d="M3.889 8.889h.555v3.889H3.89v-3.89Zm5 0h.555v3.889H8.89v-3.89Z"
    />
    <path
      fill="#66757F"
      d="M3.333 12.222H5v.556H3.333v-.556Zm5 0H10v.556H8.333v-.556ZM3.89 8.333h.555v.556H3.89v-.556Zm5 0h.555v.556H8.89v-.556Z"
    />
  </svg>
)
export default SvgSpainIcon
