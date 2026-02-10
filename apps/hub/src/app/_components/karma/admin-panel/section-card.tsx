import type { ReactNode } from 'react'

type SectionCardProps = {
  title: string
  step?: string
  description?: string
  className?: string
  children: ReactNode
}

export function SectionCard({
  title,
  step,
  description,
  className,
  children,
}: SectionCardProps) {
  return (
    <div
      className={`rounded-8 border border-neutral-20 bg-white-100 p-4 ${className ?? ''}`}
    >
      <div className="mb-3">
        <div className="flex items-center gap-2">
          {step ? (
            <span className="rounded-full bg-neutral-20 px-2 py-0.5 text-11 font-medium text-neutral-70">
              {step}
            </span>
          ) : null}
          <h4 className="text-15 font-semibold text-neutral-100">{title}</h4>
        </div>
        {description ? (
          <p className="mt-1 text-13 text-neutral-60">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  )
}
