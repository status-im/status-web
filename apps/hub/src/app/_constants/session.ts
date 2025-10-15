type SessionConfig = {
  cookieName: string
  cookieOptions: {
    httpOnly: boolean
    secure: boolean
    sameSite: 'lax' | 'strict' | 'none'
    maxAge: number
    path: string
  }
  password: string
}

export const sessionConfig: SessionConfig = {
  cookieName: 'status-hub-siwe',
  cookieOptions: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 60 * 60,
    path: '/',
  },
  password:
    'complex_password_at_least_32_characters_long_replace_in_production_env',
}
