export type BlogPostAuthor = {
  id: string
  name: string
  slug: string
  profile_image: string | null
  meta_description: string | null
}

export type BlogPostDetail = {
  slug: string
  title: string
  html: string | null
  feature_image: string | null
  feature_image_alt: string | null
  published_at: string | null
  updated_at: string | null
  codeinjection_head: string | null
  codeinjection_foot: string | null
  primary_tag: { name: string; slug: string } | null
  primary_author: BlogPostAuthor | null
}

export const BLOG_ARTICLE_CLASS_NAMES = [
  'text-19 text-neutral-100',
  '[&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-27 [&_h2]:font-600',
  '[&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-19 [&_h3]:font-600',
  '[&_h4]:mb-2 [&_h4]:mt-6 [&_h4]:text-15 [&_h4]:font-600',
  '[&_p]:mt-5 [&_p]:text-19 [&_p]:leading-[1.7]',
  '[&_a]:text-sky hover:[&_a]:underline',
  '[&_ul]:mt-5 [&_ul]:list-disc [&_ul]:pl-6',
  '[&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:pl-6',
  '[&_li]:mt-2',
  '[&_blockquote]:mt-6 [&_blockquote]:border-l [&_blockquote]:border-dashed [&_blockquote]:border-neutral-30 [&_blockquote]:pl-5',
  '[&_img]:my-8 [&_img]:rounded-16',
  '[&_pre]:mt-6 [&_pre]:overflow-x-auto [&_pre]:rounded-12 [&_pre]:bg-neutral-100 [&_pre]:p-4 [&_pre]:text-13 [&_pre]:text-white-100',
  '[&_code]:rounded [&_code]:bg-neutral-10 [&_code]:px-1 [&_code]:py-[2px] [&_code]:text-15',
  '[&_pre_code]:bg-transparent [&_pre_code]:p-0',
].join(' ')

type GhostPostLike = {
  slug: string
  title: string
  html: string | null
  feature_image: string | null
  feature_image_alt: string | null
  published_at: string | null
  updated_at: string | null
  codeinjection_head: string | null
  codeinjection_foot: string | null
  primary_tag: { name: string; slug: string } | null
  primary_author: BlogPostAuthor | null
}

export function ghostPostToDetail(post: GhostPostLike): BlogPostDetail {
  return {
    slug: post.slug,
    title: post.title,
    html: post.html,
    feature_image: post.feature_image,
    feature_image_alt: post.feature_image_alt,
    published_at: post.published_at,
    updated_at: post.updated_at,
    codeinjection_head: post.codeinjection_head,
    codeinjection_foot: post.codeinjection_foot,
    primary_tag: post.primary_tag
      ? { name: post.primary_tag.name, slug: post.primary_tag.slug }
      : null,
    primary_author: post.primary_author,
  }
}

export function blogPostDetailEqual(
  a: BlogPostDetail,
  b: BlogPostDetail,
): boolean {
  return (
    a.updated_at === b.updated_at &&
    a.html === b.html &&
    a.title === b.title &&
    a.feature_image === b.feature_image
  )
}
