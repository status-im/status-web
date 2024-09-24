import type { SVGProps } from 'react'

const SvgBrazilIcon = (props: SVGProps<SVGSVGElement>) => (
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
      fill="#009B3A"
      d="M20 15a2.222 2.222 0 0 1-2.222 2.222H2.222A2.222 2.222 0 0 1 0 15V5c0-1.227.995-2.222 2.222-2.222h15.556C19.005 2.778 20 3.773 20 5v10Z"
    />
    <path fill="#FEDF01" d="M18.182 10 10 16.18 1.818 10 10 3.82 18.182 10Z" />
    <path
      fill="#002776"
      d="M9.987 13.546a3.588 3.588 0 1 0 0-7.176 3.588 3.588 0 0 0 0 7.176Z"
    />
    <path
      fill="#CBE9D4"
      d="M6.82 8.27c-.184.346-.31.724-.373 1.124 2.22-.16 5.232 1.051 6.525 2.553.223-.335.389-.71.49-1.113-1.595-1.56-4.398-2.572-6.641-2.563Z"
    />
    <path
      fill="#88C9F9"
      d="M6.667 10.13h.555v.555h-.555v-.556Zm.555 1.11h.556v.556h-.556v-.555Z"
    />
    <path
      fill="#55ACEE"
      d="M8.333 10.13h.556v.555h-.556v-.556Zm1.111.555H10v.556h-.556v-.556Zm2.223 1.111h.555v.556h-.555v-.556ZM10 12.352h.556v.555H10v-.555Zm1.667-3.334h.555v.556h-.555v-.556Z"
    />
    <path fill="#3B88C3" d="M10.556 11.24h.555v.556h-.555v-.555Z" />
  </svg>
)
export default SvgBrazilIcon
