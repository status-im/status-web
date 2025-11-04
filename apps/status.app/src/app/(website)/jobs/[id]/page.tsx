import { createElement, Fragment } from 'react'

import { Button, Tag, Text } from '@status-im/components'
import { cx } from 'class-variance-authority'
import { redirect } from 'next/navigation'
import rehypeParse from 'rehype-parse'
import rehypeReact from 'rehype-react'
import { unified } from 'unified'

import { Metadata } from '~app/_metadata'
import { Body } from '~components/body'
import { Breadcrumbs } from '~components/breadcrumbs'
import { jobsComponents } from '~components/content'
import { getStatusJob, getStatusJobs } from '~website/_lib/greenhouse'

import { ApplicationFormDialog } from './_components/application-form-dialog'

export const revalidate = 3600 // 1 hour
export const dynamicParams = true

export async function generateStaticParams() {
  try {
    const { jobs = [] } = await getStatusJobs()
    return jobs.map(job => ({
      id: job.id.toString(),
    })) satisfies Array<Awaited<Props['params']>>
  } catch {
    return []
  }
}

type Props = {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: Props) {
  const job = await getStatusJob((await params).id)

  return Metadata({
    title: `${job.title}, ${job.location.name}`,
    description: 'Join us in our mission.',
  })
}

export default async function JobsDetailPage(props: Props) {
  const { params } = props

  const { id: jobId } = await params
  const job = await getStatusJob(jobId)

  if (!job) {
    return redirect('/jobs')
  }

  // note: decodes html entities https://github.com/orgs/rehypejs/discussions/51#discussioncomment-367057
  // note: returns `type: 'text'`
  const result = unified()
    .use(rehypeParse, { fragment: true })
    .parse(job.content)

  const content = await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeReact, {
      createElement,
      Fragment,
      components: jobsComponents,
    })
    .process((result.children[0] as any).value)

  return (
    <Body>
      <Breadcrumbs
        items={[
          {
            label: 'Jobs',
            href: '/jobs',
          },
          {
            label: job.title,
            href: `/jobs/${jobId}`,
          },
        ]}
      />

      <div className="mx-auto max-w-[742px] px-5">
        <div className="flex flex-col items-start gap-4 pb-6 pt-12 xl:pt-20">
          <Tag size="24" label={job.departments[0].name} />
          <h1 className="text-40 font-bold xl:text-64">{job.title}</h1>
          <Text size={19} color="$neutral-50">
            {job.location.name}
          </Text>
        </div>

        {/* CONTENT */}
        <div className="root-content pb-12 xl:pb-20">{content.result}</div>

        {/* FOOTER */}
        <div
          className={cx(
            'border-dashed-default -mx-5 flex flex-col items-start gap-4 border-t px-5 pb-24 pt-6',
            '2md:mx-0 2md:flex-row 2md:items-center 2md:justify-between 2md:px-0 2md:pb-40'
          )}
        >
          <div className="flex flex-col">
            <Text size={19} weight="semibold">
              Apply for this job
            </Text>
            <Text size={15}>Submit your application here</Text>
          </div>

          <ApplicationFormDialog job={job}>
            <Button size="32">Apply now</Button>
          </ApplicationFormDialog>
        </div>
      </div>
    </Body>
  )
}
