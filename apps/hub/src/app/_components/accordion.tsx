'use client'

import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDownIcon } from '@status-im/icons/20'

type AccordionItem = {
  title: string
  content: string
}

type Props = {
  items: AccordionItem[]
}

const Accordion = ({ items }: Props) => {
  return (
    <AccordionPrimitive.Root type="multiple" className="flex flex-col gap-2">
      {items.map((item, index) => (
        <AccordionPrimitive.Item
          key={index}
          value={`item-${index}`}
          className="rounded-20 border border-neutral-10 bg-white-100 p-3 shadow-1 lg:rounded-32 lg:px-8 lg:py-6"
        >
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger className="group flex w-full items-center justify-start gap-3 text-left text-15 font-500 text-neutral-100 lg:text-19">
              <div className="flex size-8 items-center justify-center rounded-full bg-customisation-purple-50/5 text-19 text-purple transition-colors duration-200 group-active:bg-customisation-purple-50/30 group-hover:bg-customisation-purple-50/20 lg:size-12">
                <ChevronDownIcon className="size-5 shrink-0 text-purple transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </div>
              <span className="transition-all group-data-[state=open]:-mt-2 lg:group-data-[state=open]:-mt-3">
                {item.title}
              </span>
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <div className="pb-4 pl-[46px] text-13 text-neutral-50 lg:pl-[62px] lg:text-15">
              {item.content}
            </div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  )
}

export { Accordion, type AccordionItem }
