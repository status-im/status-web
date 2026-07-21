/* eslint-disable jsx-a11y/heading-has-content, jsx-a11y/anchor-has-content */
import type { ComponentProps } from 'react'

export const legalComponents = {
  h1: (props: ComponentProps<'h1'>) => (
    <h1 className="text-32 mb-4 font-700" {...props} />
  ),
  h2: (props: ComponentProps<'h2'>) => (
    <h2 className="mb-4 mt-6 text-27 font-600" {...props} />
  ),
  h3: (props: ComponentProps<'h3'>) => (
    <h3 className="mb-3 mt-5 text-19 font-600" {...props} />
  ),
  p: (props: ComponentProps<'p'>) => (
    <p className="text-16 my-4 leading-relaxed" {...props} />
  ),
  ul: (props: ComponentProps<'ul'>) => (
    <ul className="my-4 list-disc pl-6" {...props} />
  ),
  ol: (props: ComponentProps<'ol'>) => (
    <ol className="my-4 list-decimal pl-6" {...props} />
  ),
  li: (props: ComponentProps<'li'>) => <li className="mb-2" {...props} />,
  a: (props: ComponentProps<'a'>) => (
    <a className="text-purple underline" {...props} />
  ),
  strong: (props: ComponentProps<'strong'>) => (
    <strong className="font-600" {...props} />
  ),
}
