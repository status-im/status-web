import { createIcon } from '../lib/create-icon'

const SvgFavouriteIcon = createIcon(props => {
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
        stroke={props.color}
        strokeWidth={1.2}
        d="M10 2.5c.5 0 2.5 5 2.5 5s5 0 5 .625-4.375 3.75-4.375 3.75S15.5 17 15 17.5s-5-3.125-5-3.125S5.5 18 5 17.5s1.875-5.625 1.875-5.625S2.5 8.75 2.5 8.125s5-.625 5-.625 2-5 2.5-5Z"
      />
    </svg>
  )
})

export default SvgFavouriteIcon
