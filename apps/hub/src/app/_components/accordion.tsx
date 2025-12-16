'use client'

import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDownIcon } from '@status-im/icons/16'

type AccordionItem = {
  title: string
  content: string
}

type Props = {
  items: AccordionItem[]
}

const Accordion = ({ items }: Props) => {
  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      className="flex flex-col"
    >
      {items.map((item, index) => (
        <AccordionPrimitive.Item
          key={index}
          value={`item-${index}`}
          className="border-b border-neutral-20 last:border-b-0"
        >
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger className="group flex w-full items-center justify-between gap-4 py-4 text-left text-15 font-500 text-neutral-100 lg:text-19">
              {item.title}
              <ChevronDownIcon className="shrink-0 text-neutral-50 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <div className="pb-4 text-15 text-neutral-50">{item.content}</div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  )
}

export { Accordion, type AccordionItem }
