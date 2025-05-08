import { Image } from '../../../../_components/assets'

export default function Loading() {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-neutral-2.5">
      <Image
        id="Portfolio/Loading/Asset:160:160"
        className="size-[72px]"
        alt=""
      />
      <p className="mb-0.5 mt-3 text-15 font-600">Fetching asset data</p>
      <p className="text-center text-13">
        Doing some woofy blockchain magic.
        <br />
        Your data will be retrieved shortly.
      </p>
    </div>
  )
}
