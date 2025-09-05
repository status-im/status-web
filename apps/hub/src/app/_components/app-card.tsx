'use client'

interface AppCardProps {
  name: string
  description: string
  category: string
  onLaunch: () => void
}

export function AppCard({
  name,
  description,
  category,
  onLaunch,
}: AppCardProps) {
  return (
    <div className="rounded-16 border border-neutral-20 bg-white-100 p-5 shadow-1 transition-colors hover:border-neutral-30">
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="bg-purple/10 text-10 rounded-full px-2 py-0.5 font-medium text-purple">
            {category}
          </span>
        </div>
        <h4 className="text-17 mb-2 font-semibold text-neutral-90">{name}</h4>
        <p className="text-13 leading-relaxed text-neutral-60">{description}</p>
      </div>

      <button
        onClick={onLaunch}
        className="w-full rounded-16 bg-neutral-10 px-3 py-2.5 text-13 font-medium text-neutral-90 transition-colors hover:bg-neutral-20"
      >
        Launch App
      </button>
    </div>
  )
}
