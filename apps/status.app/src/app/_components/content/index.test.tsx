import React from 'react'

import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import { blogComponents, specsComponents } from './index'

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

describe('specsComponents.table', () => {
  it('renders spec tables that do not include a thead', () => {
    const table = specsComponents.table({
      children: React.createElement(
        'tbody',
        null,
        React.createElement(
          'tr',
          null,
          React.createElement('td', null, 'Field'),
          React.createElement('td', null, 'Type')
        )
      ),
    })

    expect(renderToStaticMarkup(table)).toContain('Field')
    expect(renderToStaticMarkup(table)).toContain('Type')
  })
})
