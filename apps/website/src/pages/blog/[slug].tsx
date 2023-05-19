import { AppLayout, PageBody } from '@/layouts/app-layout'

import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  Page,
} from 'next'

type Params = { slug: string[] }

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  // TODO: fetch from Ghost
  return { paths: [], fallback: false }
}

type Post = {
  id: string
}

export const getStaticProps: GetStaticProps<
  { post: Post },
  Params
> = async () => {
  return { notFound: true }
  // return { props: {  } }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

const BlogDetailPage: Page<Props> = (props: Props) => {
  const { post } = props

  return <PageBody>{post.id}</PageBody>
}

BlogDetailPage.getLayout = AppLayout

export default BlogDetailPage
