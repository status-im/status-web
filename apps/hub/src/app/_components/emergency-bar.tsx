'use client'

import { AlertIcon } from '@status-im/icons/20'
import { ButtonLink } from '@status-im/status-network/components'
import { useTranslations } from 'next-intl'

const EmergencyBar = () => {
  const t = useTranslations()

  return (
    <div className="h-10 bg-danger-50 p-2" data-theme="dark">
      <div className="flex items-center justify-center gap-2">
        <p className="text-15 font-semibold text-white-100">
          {t('emergency.contracts_compromised')}
        </p>
        <ButtonLink
          variant="secondary"
          size="24"
          iconBefore={<AlertIcon />}
          href="/stake"
        >
          {t('emergency.withdraw_funds')}
        </ButtonLink>
      </div>
    </div>
  )
}

export { EmergencyBar }
