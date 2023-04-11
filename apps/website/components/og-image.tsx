import Head from 'next/head'

type Props = {
  data: {}
}

const OgImage = (props: Props) => {
  const { data } = props

  const searchParams = new URLSearchParams({
    displayName: props.unverifiedData.displayName,
    description: props.unverifiedData.description,
    membersCount: props.unverifiedData.membersCount,
    color: props.unverifiedData.color,
    // tags: indicesToTags(props.unverifiedData.tagIndices),
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
