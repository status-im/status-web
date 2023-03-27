import { createHandler } from '@/server/og'

function CommunityPreviewImage({ community }) {
  return (
    // wrapper
    <div
      style={{
        backgroundColor: '#f6f6f6',
        backgroundSize: '150px 150px',
        height: '100%',
        width: '100%',
        display: 'flex',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        flexWrap: 'nowrap',
      }}>
      {/* displayName */}
      <div
        style={{
          fontSize: 60,
          fontStyle: 'normal',
          letterSpacing: '-0.025em',
          color: 'black',
          marginTop: 30,
          padding: '0 120px',
          lineHeight: 1.4,
          whiteSpace: 'pre-wrap',
        }}>
        {community.displayName}
      </div>
      {/* description */}
      <div
        style={{
          fontSize: 20,
          fontStyle: 'normal',
          letterSpacing: '-0.025em',
          color: 'black',
          marginTop: 30,
          padding: '0 120px',
          lineHeight: 1.4,
          whiteSpace: 'pre-wrap',
        }}>
        {community.description + ' (description)'}
      </div>
      {/* membersCount */}
      <div
        style={{
          fontSize: 20,
          fontStyle: 'normal',
          letterSpacing: '-0.025em',
          color: 'black',
          marginTop: 30,
          padding: '0 120px',
          lineHeight: 1.4,
          whiteSpace: 'pre-wrap',
        }}>
        {community.membersCount + ' (members)'}
      </div>
      {/* color */}
      <div
        style={{
          backgroundColor: community.color,
          marginTop: 30,
          width: '25px',
          height: '25px',
          borderRadius: '8px',
        }}
      />
      {/* tags */}
      <div
        style={{
          fontSize: 20,
          fontStyle: 'normal',
          letterSpacing: '-0.025em',
          color: 'black',
          marginTop: 30,
          padding: '0 120px',
          lineHeight: 1.4,
          whiteSpace: 'pre-wrap',
        }}>
        {community.tags}
      </div>
    </div>
  )
}

const handler = createHandler((url) => {
  const { searchParams } = url

  // todo?: decode and validate data if passed through from server props
  const community = Object.fromEntries(searchParams.entries())

  return CommunityPreviewImage({ community })
})

// note: https://github.com/vercel/next.js/issues/41968
// export { config } from '@/server/og'
export const config = {
  runtime: 'edge',
}
export default handler
