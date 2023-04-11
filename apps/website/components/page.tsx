// todo?: rename to preview/onboarding/sharing/conversion-page/screen/invite.tsx

import { Image } from '@status-im/components'
import Script from 'next/script'

import { Head } from '@/components/head'
import { ERROR_CODES } from '@/consts/error-codes'

import type { ServerSideProps } from '@/server/ssr'

type PreviewPageProps = ServerSideProps & {
  // serverSideProps: ServerSideProps
  // verifiedData?: any
  // onContent: (data: any) => boolean
  // onRetry: () => Promise<void>
  // component: ({ data }: { data: any }) => React.ReactElement
  index?: boolean
  children: [React.ReactElement, React.ReactElement | undefined]
}

export function PreviewPage(props: PreviewPageProps) {
  const [meta, content] = Array.isArray(props.children)
    ? props.children
    : [props.children]

  const renderContent = (
    props: ServerSideProps,
    content?: React.ReactElement,
    image?: React.ReactElement
  ) => {
    if (isError(props)) {
      switch (props.errorCode) {
        case ERROR_CODES.NOT_FOUND:
          return (
            <>
              <h1>Page not found.</h1>
            </>
          )

        case ERROR_CODES.UNVERIFIED_CONTENT:
          return (
            <>
              <h1>Unverified content.</h1>
            </>
          )

        case ERROR_CODES.INTERNAL_SERVER_ERROR:
        default:
          return (
            <>
              <h1>{"Oh no, something's wrong!"}</h1>
              <p>Try reloading the page or come back later!</p>
            </>
          )
      }
    }

    // if (!verifiedData) {
    //   return null
    // }

    return (
      <div>
        {/* <div>{JSON.stringify(verifiedData)}</div> */}
        <div
          style={{
            height: 233,
            background:
              'linear-gradient(179.82deg, rgba(246, 111, 143, 1) 0.16%, rgba(0, 0, 0, 0) 99.84%)',
          }}
        ></div>
        {content}
        <Image
          src="https://images.unsplash.com/photo-1574786527860-f2e274867c91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1764&q=80"
          width="full"
          aspectRatio={1}
        />
        {/* todo: retry toast */}
        {/* todo: content-updated toast */}
        {/* fixme?: useEffect https://github.com/vercel/next.js/discussions/29737*/}
        <Script
          src="https://twemoji.maxcdn.com/v/latest/twemoji.min.js"
          onLoad={() => {
            globalThis.twemoji.parse(document.body)
          }}
        />
      </div>
    )
  }

  return (
    <>
      <Head index={props.index}>{meta}</Head>
      {/* todo: theme; based on user system settings */}
      <main id="main">
        {/* todo: install banner */}

        {/* note: development */}
        {/* {loading && <div>Loading...</div>}
        {failed && <div>Failed.</div>}
        {!loading && !failed && <div>Loaded.</div>} */}

        {/* {(() => {
          return

          // removed by linter
          // ...
        })()} */}

        {/* <Community data={data} /> */}
        {/* {isError(props) ? <></> : <></>} */}
        {/* {cloneElement(component, { data })} */}
        {renderContent(props, content /* props.verifiedData */)}
      </main>
    </>
  )
}

function isError(props: ServerSideProps): props is { errorCode: number } {
  return (props as { errorCode: number }).errorCode !== undefined
}
