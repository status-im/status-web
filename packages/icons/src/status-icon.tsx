import { createIcon } from '../lib/create-icon'

const SvgStatusIcon = createIcon(props => {
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
      <g clipPath="url(#status-icon_svg__a)">
        <path
          fill={props.color}
          fillRule="evenodd"
          d="M0 10C0 2.5 2.5 0 10 0s10 2.5 10 10-2.5 10-10 10S0 17.5 0 10Zm7.393-.616c.186-2.328 1.858-4.385 4.123-4.515 1.39-.08 2.78.77 2.854 2.148.061 1.109-.628 1.918-1.826 2.229a4.29 4.29 0 0 1-.866.135c-.637.035-1.154-.02-1.672-.075-.517-.055-1.034-.11-1.67-.074a4.454 4.454 0 0 0-.907.141l-.036.01Zm5.213 1.23c-.186 2.328-1.858 4.385-4.123 4.514-1.39.08-2.78-.769-2.855-2.147-.058-1.11.629-1.918 1.827-2.229a4.29 4.29 0 0 1 .866-.134c.636-.036 1.153.019 1.67.074.518.055 1.035.11 1.672.073a4.46 4.46 0 0 0 .87-.13l.027-.008.046-.013Z"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <clipPath id="status-icon_svg__a">
          <path fill="#fff" d="M0 0h20v20H0z" />
        </clipPath>
      </defs>
    </svg>
  )
})

export default SvgStatusIcon
