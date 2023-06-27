import { createIcon } from '../lib/create-icon'

const SvgAngryIcon = createIcon(props => {
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
      <circle cx={10} cy={10} r={10} fill="url(#angry-icon_svg__a)" />
      <circle cx={10} cy={10} r={10} fill="url(#angry-icon_svg__b)" />
      <path
        fill="#424242"
        d="M4.59 6.997a.547.547 0 1 0-.43 1.006l1.32.565c.176.076.24.292.189.477a1.251 1.251 0 0 0 2.36.813c.036-.088.137-.138.225-.1l.28.12a.547.547 0 0 0 .431-1.006L4.59 6.997Zm10.823 0a.547.547 0 1 1 .43 1.006l-1.32.565c-.176.076-.24.292-.189.477a1.25 1.25 0 0 1-2.36.813c-.036-.088-.137-.138-.225-.1l-.28.12a.547.547 0 0 1-.431-1.006l4.375-1.875Z"
      />
      <path
        fill="#772622"
        fillRule="evenodd"
        d="M10 13.672a3.2 3.2 0 0 0-2.67 1.432.547.547 0 0 1-.91-.605 4.293 4.293 0 0 1 3.58-1.92 4.29 4.29 0 0 1 3.58 1.92.547.547 0 0 1-.91.605A3.2 3.2 0 0 0 10 13.672Z"
        clipRule="evenodd"
      />
      <defs>
        <radialGradient
          id="angry-icon_svg__b"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="rotate(124.563 5.651 5.561) scale(17.0763 22.1686)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFD764" stopOpacity={0.2} />
          <stop offset={1} stopColor="#FFB746" stopOpacity={0.1} />
        </radialGradient>
        <linearGradient
          id="angry-icon_svg__a"
          x1={10}
          x2={10}
          y1={0}
          y2={20}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0.11} stopColor="#EA6433" />
          <stop offset={0.547} stopColor="#F2B660" />
          <stop offset={1} stopColor="#FFBA49" />
        </linearGradient>
      </defs>
    </svg>
  )
})

export default SvgAngryIcon
