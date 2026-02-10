import type { ReactNode } from 'react'

type SectionCardProps = {
  title: string
  className?: string
  children: ReactNode
}

export function SectionCard({ title, className, children }: SectionCardProps) {
  return (
    <div
      className={`rounded-8 border border-neutral-20 bg-white-100 p-4 ${className ?? ''}`}
    >
      <h4 className="mb-3 text-15 font-semibold text-neutral-100">{title}</h4>
      {children}
    </div>
  )
}
