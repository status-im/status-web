import { NextResponse } from 'next/server'

import { getReadonlySession, isValidSIWESession } from '~utils/session'

import type { NextRequest } from 'next/server'

/**
 * @api {get} /api/siwe/session Get Session
 * @apiName GetSession
 * @apiGroup SIWE
 *
 * @apiDescription
 * Retrieves the current SIWE authentication session data. This endpoint checks
 * for an existing authenticated session and returns the user's Ethereum address,
 * chain ID, and authentication status. No authentication required - returns null
 * values if not authenticated.
 *
 * **Use Cases:**
 * - Check if user is currently authenticated
 * - Get authenticated user's wallet address
 * - Determine which chain the user authenticated on
 * - Conditional UI rendering based on auth status
 *
 * **Session Storage:**
 * Session data is stored in an encrypted iron-session cookie, which is
 * automatically included in the request by the browser.
 *
 * **Authentication Flow:**
 * 1. Browser automatically sends session cookie with request
 * 2. Server decrypts and validates session cookie
 * 3. Returns session data if valid, null values if not authenticated
 *
 * @apiSuccess {String|null} address Ethereum address of authenticated user (null if not authenticated)
 * @apiSuccess {Number|null} chainId Chain ID the user authenticated on (null if not authenticated)
 * @apiSuccess {Boolean} isAuthenticated True if user has valid SIWE session
 *
 * @apiSuccessExample {json} Authenticated Response (200):
 *     {
 *       "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4",
 *       "chainId": 1660990954,
 *       "isAuthenticated": true
 *     }
 *
 * @apiSuccessExample {json} Unauthenticated Response (200):
 *     {
 *       "address": null,
 *       "chainId": null,
 *       "isAuthenticated": false
 *     }
 *
 * @apiError (500) {Object} error Server error
 * @apiError (500) {String} error.error Error message
 * @apiError (500) {String} error.details Detailed error information
 *
 * @apiErrorExample {json} Session Retrieval Failed (500):
 *     {
 *       "error": "Failed to retrieve session",
 *       "details": "Session decryption failed"
 *     }
 *
 * @apiExample {curl} cURL Example:
 *     curl -X GET https://status.app/api/siwe/session \
 *       --cookie "status-hub-siwe=..."
 *
 * @apiExample {javascript} JavaScript Example:
 *     // Fetch automatically includes cookies
 *     const response = await fetch('/api/siwe/session', {
 *       credentials: 'include'
 *     })
 *     const session = await response.json()
 *
 *     if (session.isAuthenticated) {
 *       console.log(`Authenticated as ${session.address}`)
 *     } else {
 *       console.log('Not authenticated')
 *     }
 *
 * @apiExample {javascript} React Hook Example:
 *     function useSession() {
 *       const [session, setSession] = useState(null)
 *
 *       useEffect(() => {
 *         fetch('/api/siwe/session')
 *           .then(res => res.json())
 *           .then(setSession)
 *       }, [])
 *
 *       return session
 *     }
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getReadonlySession(request.cookies)

    // Return session data (may have undefined values if not authenticated)
    return NextResponse.json({
      address: session.address ?? null,
      chainId: session.chainId ?? null,
      isAuthenticated: isValidSIWESession(session),
    })
  } catch (error) {
    console.error('[SIWE Session] Session retrieval error:', error)

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred'

    return NextResponse.json(
      {
        error: 'Failed to retrieve session',
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}
