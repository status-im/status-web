import { createIcon } from '../lib/create-icon'

const SvgArrowRightIcon = createIcon(props => {
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
        d="m16.944 10.404.367-.404-.367-.403-5-5.5-.888.807L15.144 9.4H4v1.2h11.144l-4.088 4.497.888.807 5-5.5Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgArrowRightIcon
