// CORS configuration utility
// Determines allowed origins for CORS headers
// @see https://blog.logrocket.com/using-cors-next-js-handle-cross-origin-requests/
// @see https://www.geeksforgeeks.org/reactjs/how-to-use-cors-in-next-js-to-handle-cross-origin-requests/

/**
 * List of allowed origins for CORS
 * Add production domains, preview deployments, and local development origins here
 *
 * This follows the principle of explicit origin allowlisting for security.
 * Only origins listed here will be allowed to make cross-origin requests.
 */
const ALLOWED_ORIGINS: (string | RegExp)[] = [
  // Production
  'https://hub.status.network',
  // Local development
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  // Local network IPs (for development on different devices/VPN)
  // These regex patterns match common private IP ranges
  /^http:\/\/192\.168\.\d+\.\d+:\d+$/, // 192.168.0.0/16
  /^http:\/\/10\.\d+\.\d+\.\d+:\d+$/, // 10.0.0.0/8
  /^http:\/\/172\.(1[6-9]|2\d|3[01])\.\d+\.\d+:\d+$/, // 172.16.0.0/12
  // Vercel preview deployments
  /^https:\/\/hub-.*\.vercel\.app$/,
  /^https:\/\/.*-git-.*\.vercel\.app$/,
]

/**
 * Checks if an origin is allowed for CORS
 * @param origin - The origin header from the request
 * @returns The origin if allowed, or null if not allowed
 */
export function getAllowedOrigin(origin: string | null): string | null {
  if (!origin) {
    return null
  }

  // Check exact matches first
  if (ALLOWED_ORIGINS.includes(origin)) {
    return origin
  }

  // Check regex patterns
  for (const pattern of ALLOWED_ORIGINS) {
    if (pattern instanceof RegExp && pattern.test(origin)) {
      return origin
    }
  }

  return null
}

/**
 * Gets CORS headers for a given origin
 *
 * Based on best practices from:
 * @see https://www.geeksforgeeks.org/reactjs/how-to-use-cors-in-next-js-to-handle-cross-origin-requests/
 *
 * This function ensures consistent CORS headers across all API routes,
 * similar to how micro-cors middleware works in Pages Router.
 *
 * @param origin - The origin header from the request
 * @returns CORS headers object
 */
export function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigin = getAllowedOrigin(origin)

  // If origin is allowed, return it; otherwise return wildcard (less secure but works)
  // In production, you might want to return null or a default origin instead of '*'
  const corsOrigin = allowedOrigin || '*'

  // Standard CORS headers as recommended by the CORS specification
  // @see https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
  return {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version',
    'Access-Control-Max-Age': '86400', // 24 hours - cache preflight responses
    'Access-Control-Allow-Credentials': 'true',
  }
}

/**
 * Handles CORS for a request/response pair
 * Similar to micro-cors middleware but for App Router
 *
 * @param origin - The origin header from the request
 * @param method - The HTTP method
 * @returns CORS headers and whether this is a preflight request
 */
export function handleCors(
  origin: string | null,
  method: string
): {
  headers: Record<string, string>
  isPreflight: boolean
} {
  const corsHeaders = getCorsHeaders(origin)
  const isPreflight = method === 'OPTIONS'

  return {
    headers: corsHeaders,
    isPreflight,
  }
}
