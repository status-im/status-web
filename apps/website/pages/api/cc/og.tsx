import { createHandler } from '@/server/og'

function ChannelPreviewImage({ channel }) {
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
        {channel.displayName}
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
        {channel.description + ' (description)'}
      </div>
      {/* emoji */}
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
        {channel.emoji}
      </div>
      {/* color */}
      <div
        style={{
          backgroundColor: channel.color,
          marginTop: 30,
          width: '25px',
          height: '25px',
          borderRadius: '8px',
        }}
      />
    </div>
  )
}

const handler = createHandler((url) => {
  const { searchParams } = url

  const channel = Object.fromEntries(searchParams.entries())

  return ChannelPreviewImage({ channel })
})

export const config = {
  runtime: 'edge',
}
export default handler
