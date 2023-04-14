import { createIcon } from '../lib/create-icon'

const SvgFriendIcon = createIcon(props => {
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
        d="M8.1 5a1.9 1.9 0 1 1 3.8 0 1.9 1.9 0 0 1-3.8 0ZM10 1.9a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 0 0 0-6.2Zm3.713 9.849c.89.841 1.59 2.363 1.678 5.151H4.609c.087-2.788.787-4.31 1.678-5.151C7.242 10.846 8.548 10.6 10 10.6c1.451 0 2.757.246 3.713 1.149ZM10 9.4c-1.548 0-3.243.254-4.537 1.476C4.166 12.101 3.4 14.174 3.4 17.5v.6h13.2v-.6c0-3.326-.766-5.399-2.063-6.624C13.242 9.654 11.548 9.4 10 9.4Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgFriendIcon
