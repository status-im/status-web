import { MDXProvider } from '@mdx-js/react'
import { Text } from '@status-im/components'
// import Image from 'next/image'
import Link from 'next/link'

import { InformationBox } from '@/components/information-box'
import { AppLayout, PageBody } from '@/layouts/app-layout'

import Test from './test.md'

import type { Page } from 'next'
// import type { ImageProps } from 'next/image'
import type { ComponentProps } from 'react'

const components = {
  h1: (props: ComponentProps<'h1'>) => (
    <h1 className="text-[40px] font-bold" {...props}>
      {props.children}
    </h1>
  ),
  h2: (props: ComponentProps<'h2'>) => (
    <h2 className="mb-4 mt-8 text-[27px] font-semibold" {...props}>
      {props.children}
    </h2>
  ),
  h3: (props: ComponentProps<'h3'>) => (
    <h3 className="mb-2 text-[19px] font-semibold" {...props}>
      {props.children}
    </h3>
  ),
  a: (props: ComponentProps<'a'>) => (
    // @ts-expect-error something with ref
    <Link href={props.href!} {...props}>
      <Text size={15} color="$primary-50" weight="semibold">
        {props.children}
      </Text>
    </Link>
  ),
  p: (props: ComponentProps<'p'>) => <Text size={15}>{props.children}</Text>,
  // img: (props: ImageProps) => (
  //   <Image
  //     alt={props.alt}
  //     sizes="100vw"
  //     style={{ width: '100%', height: 'auto' }}
  //     {...props}
  //   />
  // ),
  // pre: Pre,
  // code: InlineCode,
  blockquote: (props: ComponentProps<'blockquote'>) => {
    console.log(props)
    return <InformationBox type="tip" message="hi" />
  },
}

const LearnPage: Page = () => {
  return (
    <div>
      <PageBody>
        <h1>Learn</h1>
        <div className="mx-auto max-w-[542px]">
          <MDXProvider components={components}>
            <InformationBox
              type="info"
              message="Status doesn’t know your password and can’t reset it for you. If you forget your password, you may lose access to your Status profile and wallet funds. "
            />
            <InformationBox
              type="tip"
              message="Status doesn’t know your password and can’t reset it for you. If you forget your password, you may lose access to your Status profile and wallet funds. "
            />
            <InformationBox
              type="caution"
              message="Status doesn’t know your password and can’t reset it for you. If you forget your password, you may lose access to your Status profile and wallet funds. "
            />
            <Test />
          </MDXProvider>
        </div>
      </PageBody>
    </div>
  )
}

LearnPage.getLayout = AppLayout

export default LearnPage
