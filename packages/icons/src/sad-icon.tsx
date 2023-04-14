import { createIcon } from '../lib/create-icon'

const SvgSadIcon = createIcon(props => {
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
      <circle cx={6} cy={6} r={6} fill="#FFD764" />
      <circle cx={6} cy={6} r={6} fill="url(#sad-icon_svg__a)" />
      <path
        fill="url(#sad-icon_svg__b)"
        d="M4.043 8.44a1.125 1.125 0 0 1-2.216-.391c.09-.507.612-1.248 1.123-1.536a.448.448 0 0 1 .563.099c.381.445.62 1.32.53 1.828Z"
      />
      <path
        fill="#772622"
        fillRule="evenodd"
        d="M6 8.203c-.474 0-.794.155-1.166.34a.328.328 0 1 1-.293-.586l.002-.001c.377-.19.817-.41 1.457-.41.64 0 1.074.218 1.449.405l.01.006a.328.328 0 0 1-.293.586c-.373-.186-.687-.34-1.166-.34Z"
        clipRule="evenodd"
      />
      <path
        fill="url(#sad-icon_svg__c)"
        d="M9.781 8.885a.844.844 0 0 1-1.662.293c-.063-.357.09-.957.346-1.305a.397.397 0 0 1 .545-.097c.359.24.708.752.771 1.109Z"
      />
      <path
        fill="#424242"
        fillRule="evenodd"
        d="M3 4.172c.181 0 .328.147.328.328 0 .207.068.353.162.448.094.094.24.161.447.161.207 0 .354-.067.448-.161a.614.614 0 0 0 .162-.448.328.328 0 1 1 .656 0c0 .356-.12.678-.354.912a1.265 1.265 0 0 1-.912.354c-.355 0-.677-.12-.911-.354a1.265 1.265 0 0 1-.354-.912c0-.181.147-.328.328-.328Z"
        clipRule="evenodd"
      />
      <path
        fill="url(#sad-icon_svg__d)"
        d="M9.146 6.173a.562.562 0 1 1-1.108.196c-.037-.209.037-.542.17-.777a.332.332 0 0 1 .512-.09c.206.175.389.463.426.671Z"
      />
      <path
        fill="#424242"
        fillRule="evenodd"
        d="M7.125 4.172c.181 0 .328.147.328.328 0 .207.068.353.162.448.094.094.24.161.447.161.207 0 .354-.067.448-.161a.614.614 0 0 0 .162-.448.328.328 0 1 1 .656 0c0 .356-.12.678-.354.912a1.265 1.265 0 0 1-.912.354c-.355 0-.677-.12-.911-.354a1.265 1.265 0 0 1-.354-.912c0-.181.147-.328.328-.328Z"
        clipRule="evenodd"
      />
      <defs>
        <linearGradient
          id="sad-icon_svg__b"
          x1={3.26}
          x2={2.74}
          y1={6.398}
          y2={9.352}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6BC2FF" />
          <stop offset={1} stopColor="#2196E8" />
        </linearGradient>
        <linearGradient
          id="sad-icon_svg__c"
          x1={8.706}
          x2={9.097}
          y1={7.647}
          y2={9.862}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6BC2FF" />
          <stop offset={1} stopColor="#2196E8" />
        </linearGradient>
        <linearGradient
          id="sad-icon_svg__d"
          x1={8.429}
          x2={8.689}
          y1={5.348}
          y2={6.825}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6BC2FF" />
          <stop offset={1} stopColor="#2196E8" />
        </linearGradient>
        <radialGradient
          id="sad-icon_svg__a"
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
})

export default SvgSadIcon
