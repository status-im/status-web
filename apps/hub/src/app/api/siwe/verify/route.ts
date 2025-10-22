import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { SiweMessage } from 'siwe'

import { sessionConfig } from '~constants/session'
import { getSession } from '~utils/session'

import type { NextRequest } from 'next/server'

/**
 * @api {post} /api/siwe/verify Verify Signature
 * @apiName VerifySignature
 * @apiGroup SIWE
 *
 * @apiDescription
 * Verifies a SIWE (Sign-In with Ethereum) signature and creates an authenticated
 * session. This endpoint validates the cryptographic signature against the SIWE
 * message, checks the nonce matches the session, and stores the authenticated
 * address in the session.
 *
 * **Security:**
 * - Validates signature cryptographically using secp256k1
 * - Checks nonce matches to prevent replay attacks
 * - Verifies message hasn't expired
 * - Ensures domain and chain ID are correct
 *
 * **Flow:**
 * 1. Client gets nonce from /api/siwe/nonce
 * 2. Client creates SIWE message with nonce
 * 3. User signs message in wallet
 * 4. Client sends message + signature to this endpoint
 * 5. Server verifies and creates authenticated session
 *
 * @apiParam {String} message The SIWE message that was signed
 * @apiParam {String} signature The hex-encoded signature (0x...)
 *
 * @apiParamExample {json} Request Body:
 *     {
 *       "message": "status.app wants you to sign in with your Ethereum account:\n0x...",
 *       "signature": "0xabc123..."
 *     }
 *
 * @apiSuccess {Boolean} success True if verification succeeded
 * @apiSuccess {String} address Ethereum address that was authenticated
 * @apiSuccess {Number} chainId Chain ID the user authenticated on
 *
 * @apiSuccessExample {json} Success Response (200):
 *     {
 *       "success": true,
 *       "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4",
 *       "chainId": 1660990954
 *     }
 *
 * @apiError (400) {Object} error Validation error
 * @apiError (400) {String} error.error Error message
 *
 * @apiError (500) {Object} error Server error
 * @apiError (500) {String} error.error Error message
 * @apiError (500) {String} error.details Detailed error information
 *
 * @apiErrorExample {json} Missing Fields (400):
 *     {
 *       "error": "Missing message or signature"
 *     }
 *
 * @apiErrorExample {json} Invalid Nonce (400):
 *     {
 *       "error": "Invalid nonce. Nonce does not match session."
 *     }
 *
 * @apiErrorExample {json} Verification Failed (500):
 *     {
 *       "error": "Signature verification failed",
 *       "details": "Signature does not match address"
 *     }
 *
 * @apiExample {curl} cURL Example:
 *     curl -X POST https://status.app/api/siwe/verify \
 *       -H "Content-Type: application/json" \
 *       -d '{"message": "...", "signature": "0x..."}'
 *
 * @apiExample {javascript} JavaScript Example:
 *     const response = await fetch('/api/siwe/verify', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify({ message, signature })
 *     })
 *     const data = await response.json()
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const session = await getSession(cookieStore)

    // Parse and validate request body
    const body = await request.json()
    const { message, signature } = body

    if (!message || !signature) {
      return NextResponse.json(
        { error: 'Missing message or signature' },
        { status: 400 }
      )
    }

    // Verify nonce exists in session
    if (!session.nonce) {
      return NextResponse.json(
        { error: 'No nonce in session. Request a nonce first.' },
        { status: 400 }
      )
    }

    // Verify the SIWE message signature
    const siweMessage = new SiweMessage(message)
    const fields = await siweMessage.verify({ signature })

    // Validate nonce matches session (prevents replay attacks)
    if (fields.data.nonce !== session.nonce) {
      return NextResponse.json(
        { error: 'Invalid nonce. Nonce does not match session.' },
        { status: 400 }
      )
    }

    // Store authenticated address and chain ID in session
    session.address = fields.data.address
    session.chainId = fields.data.chainId

    // Clear nonce after successful verification (prevents reuse)
    delete session.nonce

    // Seal and persist session
    const seal = await session.getSeal()
    cookieStore.set({
      name: sessionConfig.cookieName,
      value: seal,
      ...sessionConfig.cookieOptions,
    })

    return NextResponse.json({
      success: true,
      address: fields.data.address,
      chainId: fields.data.chainId,
    })
  } catch (error) {
    console.error('[SIWE Verify] Signature verification error:', error)

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred'

    return NextResponse.json(
      {
        error: 'Signature verification failed',
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}
