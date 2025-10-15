import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { generateNonce } from 'siwe'

import { sessionConfig } from '~constants/session'
import { getSession } from '~utils/session'

/**
 * @api {get} /api/siwe/nonce Get Nonce
 * @apiName GetNonce
 * @apiGroup SIWE
 *
 * @apiDescription
 * Generates a cryptographically secure random nonce for SIWE message signing.
 * The nonce is stored in the session and must be included in the SIWE message
 * that the user signs. This prevents replay attacks by ensuring each signature
 * request is unique.
 *
 * **Flow:**
 * 1. Client requests nonce from this endpoint
 * 2. Server generates nonce and stores in session cookie
 * 3. Client includes nonce in SIWE message
 * 4. Client sends signed message to /api/siwe/verify
 *
 * **Idempotency:**
 * If a nonce already exists in the session, it will be returned without
 * generating a new one. This prevents multiple nonces per session.
 *
 * @apiSuccess {String} nonce Cryptographically secure random nonce
 *
 * @apiSuccessExample {text} Success Response (200):
 *     "a1b2c3d4e5f6g7h8"
 *
 * @apiError (500) {Object} error Error details
 * @apiError (500) {String} error.error Error message
 * @apiError (500) {String} error.details Detailed error information
 *
 * @apiErrorExample {json} Error Response (500):
 *     {
 *       "error": "Failed to generate nonce",
 *       "details": "Session encryption failed"
 *     }
 *
 * @apiExample {curl} cURL Example:
 *     curl -X GET https://status.app/api/siwe/nonce
 *
 * @apiExample {javascript} JavaScript Example:
 *     const response = await fetch('/api/siwe/nonce')
 *     const nonce = await response.text()
 */
export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = await getSession(cookieStore)

    // Generate new nonce if one doesn't exist
    if (!session.nonce) {
      session.nonce = generateNonce()

      // Seal session and set cookie with nonce
      const seal = await session.getSeal()
      cookieStore.set({
        name: sessionConfig.cookieName,
        value: seal,
        ...sessionConfig.cookieOptions,
      })
    }

    // Return nonce as plain text (ConnectKit expects text/plain)
    return new Response(session.nonce, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store, must-revalidate',
      },
    })
  } catch (error) {
    console.error('[SIWE Nonce] Error generating nonce:', error)

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred'

    return NextResponse.json(
      {
        error: 'Failed to generate nonce',
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}
