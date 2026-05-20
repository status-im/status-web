'use client'

import { useTranslations } from 'next-intl'

import { Accordion, type AccordionItem } from './accordion'

type Translations = ReturnType<typeof useTranslations>

export function getFaqItems(t: Translations): AccordionItem[] {
  return [
    {
      title: t('pre_deposits.faq_items.receiver_address_change.title'),
      content: t('pre_deposits.faq_items.receiver_address_change.content'),
    },
    {
      title: t('pre_deposits.faq_items.unlock_time_length.title'),
      content: t('pre_deposits.faq_items.unlock_time_length.content'),
    },
    {
      title: t('pre_deposits.faq_items.rewards_claiming.title'),
      content: t('pre_deposits.faq_items.rewards_claiming.content'),
    },
    {
      title: t('pre_deposits.faq_items.gusd_claiming.title'),
      content: t('pre_deposits.faq_items.gusd_claiming.content'),
    },
    {
      title: t('pre_deposits.faq_items.no_gas.title'),
      content: t('pre_deposits.faq_items.no_gas.content'),
    },
  ]
}

const PreDepositFaq = () => {
  const t = useTranslations()
  const items = getFaqItems(t)

  return <Accordion items={items} />
}

export { PreDepositFaq }
