import { createHandler } from '@/server/og'

function UserPreviewImage({ user }) {
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
      }}
    >
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
        }}
      >
        {user.displayName}
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
        }}
      >
        {user.description + ' (description)'}
      </div>
      {/* color */}
      <div
        style={{
          backgroundColor: user.color,
          marginTop: 30,
          width: '25px',
          height: '25px',
          borderRadius: '8px',
        }}
      />
    </div>
  )
}

const handler = createHandler(url => {
  const { searchParams } = url

  const user = Object.fromEntries(searchParams.entries())

  return UserPreviewImage({ user })
})

export const config = {
  runtime: 'edge',
}
export default handler
