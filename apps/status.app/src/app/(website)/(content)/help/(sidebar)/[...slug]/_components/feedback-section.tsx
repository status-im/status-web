'use client'

import { useState } from 'react'

import { Button, useToast } from '@status-im/components'
import { HeartBreakIcon, HeartIcon } from '@status-im/icons/20'
import { useTranslations } from 'next-intl'
import { match } from 'ts-pattern'

import { trackEvent } from '~app/_utils/track'

type Props = {
  articleUrl: string
}

const FeedbackSection = (props: Props) => {
  const { articleUrl } = props
  const [feedback, setFeedback] = useState<'like' | 'dislike' | 'none'>('none')

  const toast = useToast()
  const t = useTranslations('feedback')

  const submitFeedback = async (
    articleUrl: string,
    type: 'like' | 'dislike'
  ) => {
    try {
      await trackEvent('Documentation Feedback', {
        articleUrl,
        type,
      })

      setFeedback(type)
    } catch {
      toast.negative(t('errorMessage'))
    }
  }

  const { title, text } = match(feedback)
    .with('like', () => ({
      title: t('thankYou'),
      text: t('successMessage'),
    }))
    .with('dislike', () => ({
      title: t('sorryTitle'),
      text: t('sorryMessage'),
    }))
    .with('none', () => ({
      title: t('question'),
      text: t('encouragement'),
    }))
    .exhaustive()

  return (
    <div className="flex flex-col py-12">
      <div className="text-19 font-semibold">{title}</div>
      <div className="pb-4 text-15">{text}</div>
      {feedback === 'none' && (
        <div className="flex gap-3">
          <Button
            variant="danger"
            size="32"
            iconBefore={<HeartBreakIcon />}
            onPress={() => submitFeedback(articleUrl, 'dislike')}
          >
            {t('notReally')}
          </Button>
          <Button
            variant="positive"
            size="32"
            iconBefore={<HeartIcon />}
            onPress={() => submitFeedback(articleUrl, 'like')}
          >
            {t('ofCourse')}
          </Button>
        </div>
      )}
    </div>
  )
}

export { FeedbackSection }
