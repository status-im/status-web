import Link from 'next/link'

export default async function NewFirmwarePage() {
  return (
    <div className="flex flex-col">
      <h1 className="text-27">New Firmware</h1>
      <div className="flex flex-col gap-6">
        <Link href="/admin/keycard/firmwares">Back to firmwares</Link>
      </div>
    </div>
  )
}
