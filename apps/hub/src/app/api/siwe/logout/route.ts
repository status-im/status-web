import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { sessionConfig } from '~constants/session'
import { getSession } from '~utils/session'

/**
 * @api {get} /api/siwe/logout Logout
 * @apiName Logout
 * @apiGroup SIWE
 *
 * @apiDescription
 * Terminates the current SIWE authentication session by destroying session data
 * and removing the session cookie. This endpoint securely logs the user out by:
 * - Clearing all session data (address, chainId, nonce)
 * - Removing the session cookie from the browser
 * - Invalidating the encrypted session seal
 *
 * **Security:**
 * - Session destruction is immediate and irreversible
 * - Cookie is cleared with maxAge: 0 to ensure browser deletion
 * - No data persists after logout
 *
 * **Use Cases:**
 * - User clicks "Disconnect" or "Logout" button
 * - Session expiration or invalidation
 * - Account switching (logout before new auth)
 * - Security-related forced logout
 *
 * **Flow:**
 * 1. Client sends GET request to /api/siwe/logout
 * 2. Server retrieves current session from cookie
 * 3. Server destroys session data
 * 4. Server removes session cookie (sets maxAge: 0)
 * 5. Client receives success confirmation
 * 6. Client typically disconnects wallet and refreshes UI
 *
 * @apiSuccess {Boolean} success True if logout succeeded
 * @apiSuccess {String} message Success message
 *
 * @apiSuccessExample {json} Success Response (200):
 *     {
 *       "success": true,
 *       "message": "Logged out successfully"
 *     }
 *
 * @apiError (500) {Object} error Server error
 * @apiError (500) {String} error.error Error message
 * @apiError (500) {String} error.details Detailed error information
 *
 * @apiErrorExample {json} Logout Failed (500):
 *     {
 *       "error": "Failed to logout",
 *       "details": "Session destruction failed"
 *     }
 *
 * @apiExample {curl} cURL Example:
 *     curl -X GET https://status.app/api/siwe/logout \
 *       --cookie "status-hub-siwe=..."
 *
 * @apiExample {javascript} JavaScript Example:
 *     const response = await fetch('/api/siwe/logout', {
 *       credentials: 'include'
 *     })
 *     const result = await response.json()
 *
 *     if (result.success) {
 *       console.log('Logged out successfully')
 *       // Disconnect wallet, redirect, etc.
 *     }
 *
 * @apiExample {javascript} React Example:
 *     function LogoutButton() {
 *       const { disconnect } = useDisconnect()
 *       const router = useRouter()
 *
 *       const handleLogout = async () => {
 *         try {
 *           await fetch('/api/siwe/logout')
 *           disconnect() // Disconnect wallet
 *           router.push('/') // Redirect to home
 *         } catch (error) {
 *           console.error('Logout failed:', error)
 *         }
 *       }
 *
 *       return <button onClick={handleLogout}>Logout</button>
 *     }
 */
export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = await getSession(cookieStore)

    // Clear session data
    session.destroy()

    // Delete cookie using Next.js cookies API
    cookieStore.set({
      name: sessionConfig.cookieName,
      value: '',
      ...sessionConfig.cookieOptions,
      maxAge: 0,
    })

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (error) {
    console.error('[SIWE Logout] Logout error:', error)

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred'

    return NextResponse.json(
      {
        error: 'Failed to logout',
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}
