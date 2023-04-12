import { createIcon } from '../lib/create-icon'

const SvgThumbsDownIcon = createIcon(props => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width={props.width}
      height={props.height}
      fill="none"
      viewBox="0 0 12 12"
      focusable={false}
      aria-hidden={true}
    >
      <path
        fill="#FFD764"
        d="M3.375 10.572c0 .938.963 1.313 1.688 1.313.724 0 .937-.588.937-1.313 0-.436-.188-.75-.188-1.27 0-1.167.813-1.73 1.313-2.105.75-.562 2.25-.562 2.25-2.062 0-2.063-2.063-4.125-4.5-4.125a4.5 4.5 0 0 0-4.5 4.5c0 2.174 1.4 3.298 3.357 2.187.106-.06.243-.012.26.11.066.49-.146.997-.369 1.494-.248.521-.248.896-.248 1.271Z"
      />
      <path
        fill="url(#thumbs-down-icon_svg__a)"
        d="M3.375 10.572c0 .938.963 1.313 1.688 1.313.724 0 .937-.588.937-1.313 0-.436-.188-.75-.188-1.27 0-1.167.813-1.73 1.313-2.105.75-.562 2.25-.562 2.25-2.062 0-2.063-2.063-4.125-4.5-4.125a4.5 4.5 0 0 0-4.5 4.5c0 2.174 1.4 3.298 3.357 2.187.106-.06.243-.012.26.11.066.49-.146.997-.369 1.494-.248.521-.248.896-.248 1.271Z"
      />
      <path
        fill="url(#thumbs-down-icon_svg__b)"
        d="M7.97.472c.04-.32.34-.543.65-.451 2.855.846 4.29 3.967 2.756 6.57a.358.358 0 0 1-.409.156l-.634-.181c-.22-.063-.33-.305-.28-.528.358-1.583-.808-3.806-1.948-4.521a.434.434 0 0 1-.214-.412L7.97.472Z"
      />
      <defs>
        <radialGradient
          id="thumbs-down-icon_svg__a"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="matrix(3 -5.625 6.54344 3.48984 4.125 7.313)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFD764" />
          <stop offset={1} stopColor="#FFB746" />
        </radialGradient>
        <linearGradient
          id="thumbs-down-icon_svg__b"
          x1={9.944}
          x2={9.944}
          y1={6.762}
          y2={0}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2196E8" />
          <stop offset={1} stopColor="#6BC2FF" />
        </linearGradient>
      </defs>
    </svg>
  )
})

export default SvgThumbsDownIcon
