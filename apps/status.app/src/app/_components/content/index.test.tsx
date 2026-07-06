import React from 'react'

import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import { blogComponents } from './index'

vi.mock('~/i18n/navigation', () => ({
  Link: ({ href, children, ...props }: React.ComponentProps<'a'>) => (
    <a href={String(href)} {...props}>
      {children}
    </a>
  ),
}))

describe('blogComponents.table', () => {
  it('renders Ghost tables that do not include a thead', () => {
    const table = blogComponents.table({
      children: React.createElement(
        'tbody',
        null,
        React.createElement(
          'tr',
          null,
          React.createElement('td', null, 'Metric'),
          React.createElement('td', null, 'Value')
        )
      ),
    })

    expect(renderToStaticMarkup(table)).toContain('Metric')
    expect(renderToStaticMarkup(table)).toContain('Value')
  })
})
