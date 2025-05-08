'use client'

// import { Image } from '../_components/assets'

const NotAllowed = () => {
  return (
    <div className="visible relative flex h-[calc(100vh-60px)] w-full flex-col items-center justify-center rounded-[24px] bg-white-100 2md:hidden">
      <div className="relative flex size-full items-center justify-center">
        <div className="relative z-10 flex flex-col items-center justify-center">
          {/* <Image
            alt=""
            id="Portfolio/Not Allowed:160:160"
            width={160}
            height={160}
          /> */}

          <p className="pb-0.5 pt-3 text-15 font-semibold">
            Not available for this viewport
          </p>
          <p className="text-13">
            Try to open on bigger device or increase your window
          </p>
        </div>
      </div>
    </div>
  )
}

export { NotAllowed }
