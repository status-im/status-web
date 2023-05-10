import { Button, Shadow, Tag, Text } from '@status-im/components'

import { AppLayout } from '@/layouts/app-layout'

import type { Page } from 'next'

const BlogPage: Page = () => {
  return (
    <div className="bg-white-100 mx-1 min-h-[900px] rounded-3xl">
      <div className="mx-auto max-w-[1184px] py-32">
        <div className="grid gap-2">
          <h1 className="text-7xl font-bold">Blog</h1>
          <Text size={19}>Long form articles, thoughts, and ideas.</Text>
        </div>

        <div>
          <div className="mt-16 grid grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(v => (
              <PostCard key={v} />
            ))}
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <Button variant="outline">Load more posts</Button>
        </div>
      </div>
    </div>
  )
}

const PostCard = () => {
  return (
    <Shadow className="border-neutral-5 rounded-[20px] border">
      <div className="flex flex-col gap-2 p-4">
        <div className="self-start">
          <Tag size={24} label="Updates" />
        </div>
        <Text size={19} weight="semibold">
          Long form articles, thoughts, and ideas.
        </Text>
        <div className="flex gap-1">
          <Text size={15} weight="semibold">
            Status
          </Text>
          <Text size={15} color="$neutral-50">
            on Jul 12, 2022
          </Text>
        </div>
      </div>
      <div className="px-2 pb-2">
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img
          className="rounded-2xl"
          style={{
            aspectRatio: '366/206',
            objectFit: 'cover',
          }}
          src="https://images.unsplash.com/photo-1683053243792-28e9d984c25a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1780&q=80"
        />
      </div>
    </Shadow>
  )
}

BlogPage.getLayout = AppLayout

export default BlogPage
