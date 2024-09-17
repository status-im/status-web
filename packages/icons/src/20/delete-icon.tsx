import type { SVGProps } from 'react'

const SvgDeleteIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 20 20"
    aria-hidden={true}
    focusable={false}
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M10 1.9c-.635 0-1.192.03-1.661.141-.481.113-.904.318-1.228.689-.317.362-.488.824-.584 1.35a8.84 8.84 0 0 0-.12 1.32H2.5v1.2H3.902c.009 2.345.074 4.21.229 5.689.166 1.594.441 2.793.9 3.675.475.915 1.14 1.472 2.011 1.781.832.295 1.83.355 2.959.355s2.126-.06 2.958-.355c.871-.309 1.536-.866 2.012-1.78.458-.883.733-2.082.9-3.676.154-1.479.22-3.344.229-5.689H17.5V5.4H13.592a8.841 8.841 0 0 0-.12-1.32c-.096-.526-.266-.988-.583-1.35-.324-.37-.747-.576-1.228-.689-.469-.11-1.026-.141-1.661-.141ZM7.627 5.4h-.019c.014-.45.045-.811.1-1.104.075-.412.185-.638.306-.776.113-.13.284-.237.6-.31.328-.078.77-.11 1.386-.11.615 0 1.057.032 1.386.11.316.073.487.18.6.31.12.138.23.364.306.776.054.293.086.655.1 1.104H7.625Zm-2.304 6.764C5.175 10.746 5.11 8.93 5.101 6.6H14.899c-.01 2.33-.074 4.146-.223 5.564-.161 1.547-.417 2.566-.771 3.247-.337.648-.766.997-1.348 1.203-.621.22-1.436.286-2.557.286s-1.936-.065-2.557-.286c-.582-.206-1.011-.555-1.348-1.203-.354-.68-.61-1.7-.772-3.247ZM7.9 13.5V9h1.2v4.5H7.9Zm3 0V9h1.2v4.5h-1.2Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgDeleteIcon