import { createIcon } from '../lib/create-icon'

const SvgThumbsUpIcon = createIcon(props => {
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
        fill="url(#thumbs-up-icon_svg__a)"
        d="M7.342 19.021c-.066.532-.568.905-1.082.753-4.76-1.41-7.15-6.613-4.596-10.95a.597.597 0 0 1 .682-.261l1.057.302c.366.104.552.509.468.88-.599 2.638 1.345 6.342 3.246 7.535.236.148.392.41.357.687l-.132 1.054Z"
      />
      <path
        fill="#FFD764"
        d="M15 2.188C15 .938 14.062 0 12.5 0c-1.25 0-1.875.98-1.875 2.188 0 .727.313 1.25.313 2.118 0 1.944-.938 2.881-2.188 3.506C7.5 8.437 5 8.437 5 11.25c0 3.438 3.438 6.875 7.5 6.875 4.063 0 7.5-3.125 7.5-7.5 0-3.491-2.167-5.358-5.24-3.833-.364.18-.822.015-.827-.391-.008-.676.217-1.35.442-2.026.313-.938.625-1.563.625-2.188Z"
      />
      <path
        fill="url(#thumbs-up-icon_svg__b)"
        d="M15 2.188C15 .938 14.062 0 12.5 0c-1.25 0-1.875.98-1.875 2.188 0 .727.313 1.25.313 2.118 0 1.944-.938 2.881-2.188 3.506C7.5 8.437 5 8.437 5 11.25c0 3.438 3.438 6.875 7.5 6.875 4.063 0 7.5-3.125 7.5-7.5 0-3.491-2.167-5.358-5.24-3.833-.364.18-.822.015-.827-.391-.008-.676.217-1.35.442-2.026.313-.938.625-1.563.625-2.188Z"
      />
      <defs>
        <radialGradient
          id="thumbs-up-icon_svg__b"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="matrix(-5.31254 9.375 -10.9057 -6.17995 13.75 7.5)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFD764" />
          <stop offset={1} stopColor="#FFB746" />
        </radialGradient>
        <linearGradient
          id="thumbs-up-icon_svg__a"
          x1={4.052}
          x2={4.052}
          y1={8.539}
          y2={19.808}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6BC2FF" />
          <stop offset={1} stopColor="#2196E8" />
        </linearGradient>
      </defs>
    </svg>
  )
})

export default SvgThumbsUpIcon
