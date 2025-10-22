import { sealData, unsealData } from 'iron-session'

import { sessionConfig } from '~constants/session'

import type { IronSession } from 'iron-session'
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import type {
  RequestCookies,
  ResponseCookies,
} from 'next/dist/server/web/spec-extension/cookies'

// ============================================================================
// Types
// ============================================================================

/**
 * Map of password IDs to password strings for iron-session
 * Allows password rotation by using multiple passwords with different IDs
 */
type PasswordsMap = Record<number, string>

/**
 * Password can be a single string or a map for rotation
 */
type Password = string | PasswordsMap

/**
 * SIWE Session Data
 * Extends IronSession with SIWE-specific fields
 */
export interface SIWESessionData extends IronSession<object> {
  /** Unique nonce for SIWE message */
  nonce?: string
  /** Ethereum address of authenticated user */
  address?: string
  /** Chain ID the user authenticated on */
  chainId?: number
}

/**
 * Session with utility methods
 * Combines session data with helper functions for sealing and destroying
 */
export interface NextSIWESession extends SIWESessionData {
  /** Get sealed session string for cookie storage */
  getSeal: () => Promise<string>
  /** Clear session data and cookie */
  destroy: () => void
  /** Save session data (iron-session compatibility) */
  save: () => Promise<void>
  /** Update session (iron-session compatibility) */
  updateConfig: (newSessionOptions: unknown) => void
}

/**
 * Readonly session without modification methods
 */
export type ReadonlyNextSIWESession = Omit<
  NextSIWESession,
  'getSeal' | 'destroy'
>

/**
 * Supported cookie types from Next.js
 */
type CookieStore = ReadonlyRequestCookies | RequestCookies | ResponseCookies

/**
 * Writable cookie types (excludes readonly)
 */
type WritableCookieStore = RequestCookies | ResponseCookies

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Normalize password to map format for iron-session
 * Single strings are converted to { 1: password }
 *
 * @param password - Password string or map
 * @returns Password map for iron-session
 */
function normalizePasswordToMap(password: Password): PasswordsMap {
  return typeof password === 'string' ? { 1: password } : password
}

// ============================================================================
// Session Functions
// ============================================================================

/**
 * Get a readonly session from cookies
 * Does not provide methods to modify or persist the session
 *
 * @param cookies - Cookie store from Next.js request
 * @returns Promise resolving to readonly session data
 *
 * @example
 * ```typescript
 * import { cookies } from 'next/headers'
 *
 * const session = await getReadonlySession(cookies())
 * console.log(session.address) // "0x123..."
 * ```
 */
export async function getReadonlySession(
  cookies: CookieStore
): Promise<ReadonlyNextSIWESession> {
  const passwordsAsMap = normalizePasswordToMap(sessionConfig.password)
  const sealFromCookies = cookies.get(sessionConfig.cookieName)

  // If no cookie exists, return empty session
  if (!sealFromCookies?.value) {
    return {} as ReadonlyNextSIWESession
  }

  try {
    // Unseal the session data from the cookie
    const session = await unsealData<SIWESessionData>(sealFromCookies.value, {
      password: passwordsAsMap,
    })

    return session as ReadonlyNextSIWESession
  } catch (error) {
    // If unsealing fails (corrupted cookie, wrong password, etc.), return empty
    console.error('Failed to unseal session:', error)
    return {} as ReadonlyNextSIWESession
  }
}

/**
 * Get a full session with modification methods
 * Provides getSeal() and destroy() methods for persisting/clearing session
 *
 * @param cookies - Writable cookie store from Next.js request
 * @returns Promise resolving to session with utility methods
 *
 * @example
 * ```typescript
 * import { cookies } from 'next/headers'
 *
 * const session = await getSession(cookies())
 * session.address = '0x123...'
 * const seal = await session.getSeal()
 * cookies().set(cookieName, seal)
 * ```
 */
export async function getSession(
  cookies: WritableCookieStore
): Promise<NextSIWESession> {
  const passwordsAsMap = normalizePasswordToMap(sessionConfig.password)
  const readonlySession = await getReadonlySession(cookies)

  // Create a mutable copy of the session
  const session = { ...readonlySession } as NextSIWESession

  // Add getSeal method to seal and return session data
  Object.defineProperty(session, 'getSeal', {
    enumerable: false, // Don't include in Object.keys()
    writable: false,
    value: async function getSeal(): Promise<string> {
      const seal = await sealData(session, {
        password: passwordsAsMap,
      })

      return seal
    },
  })

  // Add destroy method to clear session
  Object.defineProperty(session, 'destroy', {
    enumerable: false, // Don't include in Object.keys()
    writable: false,
    value: function destroy(): void {
      // Clear all session data
      const keys = Object.keys(session) as Array<keyof NextSIWESession>
      keys.forEach(key => {
        if (key !== 'getSeal' && key !== 'destroy') {
          delete session[key]
        }
      })

      // Clear the cookie
      cookies.set({
        name: sessionConfig.cookieName,
        value: '',
        maxAge: 0,
        path: sessionConfig.cookieOptions.path,
      })
    },
  })

  return session
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check if a session is authenticated
 * A session is considered authenticated if it has an address
 *
 * @param session - Session to check
 * @returns True if session has an address
 */
export function isAuthenticated(
  session: Partial<SIWESessionData>
): session is Required<Pick<SIWESessionData, 'address'>> {
  return Boolean(session.address)
}

/**
 * Validate session has required SIWE fields
 *
 * @param session - Session to validate
 * @returns True if session has address and chainId
 */
export function isValidSIWESession(
  session: Partial<SIWESessionData>
): session is Required<Pick<SIWESessionData, 'address' | 'chainId'>> {
  return Boolean(session.address && session.chainId)
}
