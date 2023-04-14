import { createIcon } from '../lib/create-icon'

const SvgFlashlightOnIcon = createIcon(props => {
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
        fill={props.color}
        fillRule="evenodd"
        d="M11.6 3.5V1.903l-1.052 1.202-7 8-.87.995H8.4v5.997l1.052-1.202 7-8 .87-.995H11.6V3.5ZM9 10.9H5.322L10.4 5.097V9.1h4.278L9.6 14.903V10.9H9Zm4.454 3.403.849-.849L16 15.151l1.697-1.697.849.849L16.849 16l1.697 1.697-.849.849L16 16.849l-1.697 1.697-.849-.849L15.151 16l-1.697-1.697Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgFlashlightOnIcon
