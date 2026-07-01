export default function CmsHomePage() {
  return (
    <main
      style={{
        display: 'grid',
        gap: '1rem',
        maxWidth: '720px',
        margin: '0 auto',
        minHeight: '100vh',
        alignContent: 'center',
        padding: '2rem',
      }}
    >
      <span
        style={{
          width: 'fit-content',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '999px',
          padding: '0.35rem 0.75rem',
          fontSize: '0.875rem',
        }}
      >
        Payload CMS
      </span>
      <h1 style={{ fontSize: '3rem', lineHeight: 1.05, margin: 0 }}>
        Standalone CMS app inside a Turborepo workspace.
      </h1>
      <p
        style={{
          color: 'rgba(243,244,246,0.72)',
          fontSize: '1.125rem',
          margin: 0,
        }}
      >
        Use this app for admin, content APIs, migrations, and generated types.
        Keep the public frontend deployed independently in `apps/web`.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <a
          href="/admin"
          style={{
            background: '#f3f4f6',
            color: '#0b1020',
            borderRadius: '999px',
            padding: '0.75rem 1rem',
            textDecoration: 'none',
          }}
        >
          Open Admin
        </a>
        <a
          href="/api/pages"
          style={{
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '999px',
            padding: '0.75rem 1rem',
            textDecoration: 'none',
          }}
        >
          REST API
        </a>
      </div>
    </main>
  )
}
