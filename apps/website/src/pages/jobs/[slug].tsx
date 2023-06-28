import { Button, Tag, Text } from '@status-im/components'
import { cx } from 'class-variance-authority'

import { Breadcrumbs } from '@/components/breadcrumbs'
import { AppLayout, Content } from '@/layouts/app-layout'

import type { BreadcrumbsProps } from '@/components/breadcrumbs'
import type { GetStaticPaths, GetStaticProps, Page } from 'next'
import type React from 'react'

type Params = { slug: string }

const SLUG = 'senior-react-native-ui-developer'

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  return {
    paths: [
      {
        params: {
          slug: SLUG,
        },
      },
    ],
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<Props, Params> = async () => {
  // root
  const breadcrumbs = [
    {
      label: 'Jobs',
      // TODO: typesafe
      href: '/jobs',
    },
    {
      label: 'Senior React Native UI Developer',
      href: `/jobs/${SLUG}`,
    },
  ]

  return {
    props: {
      breadcrumbs,
    },
  }
}

type Props = {
  breadcrumbs: BreadcrumbsProps['items']
}

const JobsDetailPage: Page<Props> = props => {
  const { breadcrumbs } = props

  return (
    <Content>
      <Breadcrumbs items={breadcrumbs} />

      <div className="mx-auto max-w-[742px] px-5">
        <div className="flex flex-col items-start gap-4 pb-6 pt-12 lg:pt-20">
          <Tag size={24} label="Mobile" />
          <h1 className="text-40 lg:text-64">
            Senior React Native UI Developer
          </h1>
          <Text size={19} color="$neutral-50">
            Full time, Remote (Worldwide)
          </Text>
        </div>

        {/* CONTENT */}
        <div className="pb-12 pt-6 lg:pb-20">
          <Text size={19}>
            The role We’re growing our mobile development team. Join us in
            building a fully decentralized, censorship resistant, privacy first
            group chat platform that leverages the Ethereum blockchain to enable
            individuals and groups worldwide to communicate and transact with
            one another freely without restriction. Status is looking for an UI
            Engineer to join our mobile development team who will work closely
            with Design to transform UI specifications into beautiful, smooth,
            performant and near pixel perfect interactive interfaces. The ideal
            person will be comfortable working on features end-to-end, has an
            eye for design and visual detail, enjoys working with designers as
            well as developers, and who can transform reused UI patterns such as
            list items into reusable UI components.
            <br />
            <br />
            The ideal candidate will love finessing UI implementations to the
            highest levels of quality and will care deeply about things like
            code cleanliness, reusability, maintainability, performance, and UI
            layout accuracy - as well as doing whatever needed to create a
            best-in-class user experience for Status’s users. Willingness to
            both learn and share your knowledge with others,
            product-orientation, and making sure all team members are aligned
            when developing new features, will make you successful in the role.
            Status is a fast-paced, flat organization, working on cutting edge
            blockchain and decentralized messaging technologies in a dynamic
            landscape. We look forward to meeting you!
          </Text>

          <Text size={19}>
            The role We’re growing our mobile development team. Join us in
            building a fully decentralized, censorship resistant, privacy first
            group chat platform that leverages the Ethereum blockchain to enable
            individuals and groups worldwide to communicate and transact with
            one another freely without restriction. Status is looking for an UI
            Engineer to join our mobile development team who will work closely
            with Design to transform UI specifications into beautiful, smooth,
            performant and near pixel perfect interactive interfaces. The ideal
            person will be comfortable working on features end-to-end, has an
            eye for design and visual detail, enjoys working with designers as
            well as developers, and who can transform reused UI patterns such as
            list items into reusable UI components.
            <br />
            <br />
            The ideal candidate will love finessing UI implementations to the
            highest levels of quality and will care deeply about things like
            code cleanliness, reusability, maintainability, performance, and UI
            layout accuracy - as well as doing whatever needed to create a
            best-in-class user experience for Status’s users. Willingness to
            both learn and share your knowledge with others,
            product-orientation, and making sure all team members are aligned
            when developing new features, will make you successful in the role.
            Status is a fast-paced, flat organization, working on cutting edge
            blockchain and decentralized messaging technologies in a dynamic
            landscape. We look forward to meeting you!
          </Text>
        </div>

        {/* FOOTER */}
        <div
          className={cx(
            'border-dashed-default -mx-5 flex flex-col items-start gap-4 border-t px-5 pb-24 pt-6',
            'md:mx-0 md:flex-row md:items-center md:justify-between md:px-0 md:pb-40'
          )}
        >
          <div className="flex flex-col">
            <Text size={19} weight="semibold">
              Apply for this job
            </Text>
            <Text size={15}>Submit your application here</Text>
          </div>
          <Button size={32}>Apply now</Button>
        </div>
      </div>
    </Content>
  )
}

JobsDetailPage.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>
}

export default JobsDetailPage
