import { createIcon } from '../lib/create-icon'

const SvgLoveIcon = createIcon(props => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width={props.width}
      height={props.height}
      fill="none"
      viewBox="0 0 20 20"
      focusable={false}
      aria-hidden={true}
    >
      <path
        fill="#E45852"
        d="M.625 6.875C.625 12.5 7.239 18.75 10 18.75s9.375-6.25 9.375-11.875c0-2.761-1.875-5-4.375-5-2.197 0-4.063.99-4.734 3.125-.133.313-.2.313-.266.313s-.133 0-.266-.313C9.064 2.864 7.197 1.875 5 1.875c-2.5 0-4.375 2.239-4.375 5Z"
      />
      <path
        fill="url(#love-icon_svg__a)"
        d="M.625 6.875C.625 12.5 7.239 18.75 10 18.75s9.375-6.25 9.375-11.875c0-2.761-1.875-5-4.375-5-2.197 0-4.063.99-4.734 3.125-.133.313-.2.313-.266.313s-.133 0-.266-.313C9.064 2.864 7.197 1.875 5 1.875c-2.5 0-4.375 2.239-4.375 5Z"
      />
      <defs>
        <radialGradient
          id="love-icon_svg__a"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="rotate(93.897 1.92 7.969) scale(12.9315 12.3688)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F05D56" />
          <stop offset={1} stopColor="#D15954" />
        </radialGradient>
      </defs>
    </svg>
  )
})

export default SvgLoveIcon
