import { describe, expect, test } from 'vitest'

import {
  buildHelpDocStructuredData,
  buildLandingPageStructuredData,
  extractFAQItemsFromMarkdown,
} from './structured-data'

describe('status.app structured data', () => {
  test('builds Article and FAQ schema for help docs with common questions', () => {
    const schema = buildHelpDocStructuredData({
      title: 'Download Status for Mac',
      raw: `The Status desktop app is the best way to experience Status on macOS.

## Download the Status app

1. Visit the [Status website](https://status.app/).

## Common questions

### I downloaded Status from a different website

Always download Status from the official Status website.

### Nothing happens on my Mac when I try to open Status

Make sure your Mac has the minimum software required to run Status.`,
      lastEdited: '2026-07-06T00:00:00.000Z',
      author: 'jorge-campo',
    })

    expect(schema).toHaveLength(2)
    expect(schema[0]).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Download Status for Mac',
      description:
        'The Status desktop app is the best way to experience Status on macOS.',
      dateModified: '2026-07-06T00:00:00.000Z',
      author: {
        '@type': 'Person',
        name: 'jorge-campo',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Status',
      },
    })
    // `lastEdited` is a modification timestamp, so `datePublished` must be
    // omitted rather than derived from the modified date.
    expect(schema[0]).not.toHaveProperty('datePublished')
    expect(schema[1]).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'I downloaded Status from a different website',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Always download Status from the official Status website.',
          },
        },
        {
          '@type': 'Question',
          name: 'Nothing happens on my Mac when I try to open Status',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Make sure your Mac has the minimum software required to run Status.',
          },
        },
      ],
    })
  })

  test('uses the first non-heading paragraph as the Article description when markdown starts with a heading', () => {
    const schema = buildHelpDocStructuredData({
      title: 'Getting started with Status',
      raw: `# Getting started with Status

Status is a secure messenger, crypto wallet, and Web3 browser.

## Next steps

Create your profile to begin.`,
      lastEdited: '2026-07-06T00:00:00.000Z',
    })

    expect(schema[0]).toMatchObject({
      '@type': 'Article',
      description:
        'Status is a secure messenger, crypto wallet, and Web3 browser.',
    })
  })

  test('extracts FAQ items from dedicated FAQ articles with category headings', () => {
    expect(
      extractFAQItemsFromMarkdown(
        `# Not frontmatter

## About Status Wallet

### Is Status Wallet open source?

Yes. Status Wallet is open source.

### Is Status Wallet self-custodial?

Yes. Status Wallet is self-custodial.`,
        { title: 'Status Wallet: FAQ' }
      )
    ).toEqual([
      {
        question: 'Is Status Wallet open source?',
        answer: 'Yes. Status Wallet is open source.',
      },
      {
        question: 'Is Status Wallet self-custodial?',
        answer: 'Yes. Status Wallet is self-custodial.',
      },
    ])
  })

  test('does not treat a `#`-prefixed comment inside a fenced code block as a heading', () => {
    expect(
      extractFAQItemsFromMarkdown(
        `## Common questions

### How do I install the CLI?

Run the setup script below:

\`\`\`bash
# Install dependencies first
npm install
# Then run setup
npm run setup
\`\`\`

That's it, you're all set.

### What if setup fails?

Check the logs for errors.`
      )
    ).toEqual([
      {
        question: 'How do I install the CLI?',
        answer: expect.stringContaining('npm install'),
      },
      {
        question: 'What if setup fails?',
        answer: 'Check the logs for errors.',
      },
    ])
  })

  test('recognizes "FAQs" (plural) and "Frequently Asked Questions" as FAQ sections', () => {
    expect(
      extractFAQItemsFromMarkdown(
        `## Frequently Asked Questions

### Is Status free to use?

Yes, Status is free.`
      )
    ).toEqual([
      {
        question: 'Is Status free to use?',
        answer: 'Yes, Status is free.',
      },
    ])

    expect(
      extractFAQItemsFromMarkdown(
        `### Is Status Wallet self-custodial?

Yes. Status Wallet is self-custodial.`,
        { title: 'Status Wallet FAQs' }
      )
    ).toEqual([
      {
        question: 'Is Status Wallet self-custodial?',
        answer: 'Yes. Status Wallet is self-custodial.',
      },
    ])
  })

  test('builds WebPage schema for key landing pages', () => {
    expect(
      buildLandingPageStructuredData({
        name: 'Status Wallet',
        description: 'A private crypto wallet for Ethereum assets.',
        path: '/wallet',
      })
    ).toEqual({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Status Wallet',
      description: 'A private crypto wallet for Ethereum assets.',
      url: 'https://status.app/wallet',
    })
  })
})
