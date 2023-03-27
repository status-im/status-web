import Head from 'next/head'

type Props = {
  data: any
}

const OgImage = (props: Props) => {
  const { data } = props

  const searchParams = new URLSearchParams({
    displayName: data.displayName,
    description: data.description,
    membersCount: data.membersCount,
    color: data.color,
    // tags: indicesToTags(data.tagIndices),
  })

  // return (
  //   <meta
  //     property="og:image"
  //     content={`${
  //       process.env.VERCEL_URL
  //         ? 'https://' + process.env.VERCEL_URL
  //         : ''
  //     }/api/c/og?${searchParams.toString()}`}
  //   />
  // )

  return (
    <Head>
      <meta
        property="og:image"
        content={`${
          process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : ''
        }/api/c/og?${searchParams.toString()}`}
      />
    </Head>
  )
}
