'use client'

import { useTranslations } from 'next-intl'

import { Accordion, type AccordionItem } from './accordion'

type Translations = ReturnType<typeof useTranslations>

export function getFaqItems(t: Translations): AccordionItem[] {
  return [
    {
      title: t('pre_deposits.faq_items.when_unlocked.title'),
      content: t('pre_deposits.faq_items.when_unlocked.content'),
    },
    {
      title: t('pre_deposits.faq_items.wallet_warning.title'),
      content: t('pre_deposits.faq_items.wallet_warning.content'),
    },
    {
      title: t('pre_deposits.faq_items.incentive_rewards.title'),
      content: t('pre_deposits.faq_items.incentive_rewards.content'),
    },
  ]
}

const PreDepositFaq = () => {
  const t = useTranslations()
  const items = getFaqItems(t)

  return <Accordion items={items} />
}

export { PreDepositFaq }
