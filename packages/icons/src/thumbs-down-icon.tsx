import { createIcon } from '../lib/create-icon'

const SvgThumbsDownIcon = createIcon(props => {
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
        fill="#FFD764"
        d="M5.625 17.62c0 1.563 1.604 2.188 2.813 2.188 1.208 0 1.562-.98 1.562-2.187 0-.728-.313-1.25-.313-2.119 0-1.944 1.354-2.88 2.188-3.506 1.25-.938 3.75-.938 3.75-3.438 0-3.437-3.438-6.875-7.5-6.875a7.5 7.5 0 0 0-7.5 7.5c0 3.624 2.335 5.497 5.594 3.645.177-.1.406-.02.434.182.11.818-.242 1.664-.614 2.492-.414.869-.414 1.494-.414 2.119Z"
      />
      <path
        fill="url(#thumbs-down-icon_svg__a)"
        d="M5.625 17.62c0 1.563 1.604 2.188 2.813 2.188 1.208 0 1.562-.98 1.562-2.187 0-.728-.313-1.25-.313-2.119 0-1.944 1.354-2.88 2.188-3.506 1.25-.938 3.75-.938 3.75-3.438 0-3.437-3.438-6.875-7.5-6.875a7.5 7.5 0 0 0-7.5 7.5c0 3.624 2.335 5.497 5.594 3.645.177-.1.406-.02.434.182.11.818-.242 1.664-.614 2.492-.414.869-.414 1.494-.414 2.119Z"
      />
      <path
        fill="url(#thumbs-down-icon_svg__b)"
        d="M13.283.787c.066-.532.568-.905 1.082-.753 4.76 1.41 7.15 6.613 4.595 10.95a.597.597 0 0 1-.681.261l-1.057-.302c-.366-.104-.552-.509-.468-.88.598-2.638-1.345-6.342-3.246-7.535-.236-.148-.392-.41-.357-.686l.132-1.055Z"
      />
      <defs>
        <radialGradient
          id="thumbs-down-icon_svg__a"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="matrix(5 -9.375 10.9057 5.81638 6.875 12.188)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFD764" />
          <stop offset={1} stopColor="#FFB746" />
        </radialGradient>
        <linearGradient
          id="thumbs-down-icon_svg__b"
          x1={16.573}
          x2={16.573}
          y1={11.27}
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
