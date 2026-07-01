interface LogosAdminIconProps {
  fill?: string
}

export function LogosAdminIcon({ fill: _fill }: LogosAdminIconProps) {
  return (
    <img
      alt="Logos"
      src="/favicon.ico"
      style={{
        display: 'block',
        height: '100%',
        objectFit: 'contain',
        width: '100%',
      }}
    />
  )
}
