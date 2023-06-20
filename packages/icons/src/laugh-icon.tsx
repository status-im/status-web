import { createIcon } from '../lib/create-icon'

const SvgLaughIcon = createIcon(props => {
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
      <circle cx={10} cy={10} r={10} fill="#FFD764" />
      <circle cx={10} cy={10} r={10} fill="url(#laugh-icon_svg__a)" />
      <path
        fill="#772622"
        d="M15.625 12.188c0 2.76-3.125 4.687-5.625 4.687s-5.625-1.926-5.625-4.688c0-1.25 2.813-1.874 5.625-1.874 2.813 0 5.625.624 5.625 1.874Z"
      />
      <path
        fill="#fff"
        d="M13.349 11.718c-.55-.185-1.667-.468-3.349-.468-1.682 0-2.799.283-3.349.468-.226.076-.315.33-.208.543a.43.43 0 0 0 .386.239h6.342a.43.43 0 0 0 .386-.239c.107-.213.018-.467-.208-.543Z"
      />
      <path
        fill="#E45852"
        d="M11.84 14.857a.372.372 0 0 1-.028.67 4.253 4.253 0 0 1-1.812.41 4.253 4.253 0 0 1-1.812-.41.372.372 0 0 1-.028-.67 3.734 3.734 0 0 1 1.84-.482c.669 0 1.297.175 1.84.482Z"
      />
      <path
        fill="#424242"
        fillRule="evenodd"
        d="M5.127 5.822a.547.547 0 0 1 .77-.07l1.875 1.562a.547.547 0 0 1-.35.967c-.867 0-2.13.281-2.835.722a.547.547 0 1 1-.58-.928c.482-.3 1.113-.529 1.75-.678.129-.03.17-.196.07-.28l-.63-.525a.547.547 0 0 1-.07-.77Zm9.746 0a.547.547 0 0 0-.77-.07l-1.875 1.562a.547.547 0 0 0 .35.967c.867 0 2.13.281 2.835.722a.547.547 0 0 0 .58-.928c-.482-.3-1.114-.529-1.75-.678-.129-.03-.17-.196-.07-.28l.63-.525a.547.547 0 0 0 .07-.77Z"
        clipRule="evenodd"
      />
      <defs>
        <radialGradient
          id="laugh-icon_svg__a"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="rotate(124.563 5.651 5.561) scale(17.0763 22.1686)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFD764" />
          <stop offset={1} stopColor="#FFB746" />
        </radialGradient>
      </defs>
    </svg>
  )
})

export default SvgLaughIcon
