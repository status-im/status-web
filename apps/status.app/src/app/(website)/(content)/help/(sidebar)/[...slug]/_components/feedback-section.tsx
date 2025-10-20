'use client'

import { useState } from 'react'

import { Button, useToast } from '@status-im/components'
import { HeartBreakIcon, HeartIcon } from '@status-im/icons/20'
import { match } from 'ts-pattern'

import { trackEvent } from '~app/_utils/track'

type Props = {
  articleUrl: string
}

const FeedbackSection = (props: Props) => {
  const { articleUrl } = props
  const [feedback, setFeedback] = useState<'like' | 'dislike' | 'none'>('none')

  const toast = useToast()

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
      toast.negative('Something went wrong. Please try again later.')
    }
  }

  const { title, text } = match(feedback)
    .with('like', () => ({
      title: 'Thank you for your feedback. 😎',
      text: 'Your feedback was successfully submitted!',
    }))
    .with('dislike', () => ({
      title: "We're sorry to hear that. 🙏",
      text: "We'll do our best to improve this article.",
    }))
    .with('none', () => ({
      title: 'Was this article helpful?',
      text: 'Every feedback takes us closer to helping you!',
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
            Not really
          </Button>
          <Button
            variant="positive"
            size="32"
            iconBefore={<HeartIcon />}
            onPress={() => submitFeedback(articleUrl, 'like')}
          >
            Of course
          </Button>
        </div>
      )}
    </div>
  )
}

export { FeedbackSection }
