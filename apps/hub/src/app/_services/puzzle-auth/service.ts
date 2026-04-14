import { solvePuzzle } from './solver'
import { tokenStore } from './token-store'
import { parseJwtExp } from './utils'

import type {
  ProgressCallback,
  PuzzleAuthConfig,
  PuzzleAuthResult,
  Solution,
  StatusCallback,
  TokenData,
} from './types'

const DEFAULTS = {
  maxAttempts: 100000,
  expiryBuffer: 5 * 60 * 1000, // 5 minutes
} as const

const createError = (
  code: string,
  message: string,
  status?: number
): PuzzleAuthResult => ({
  success: false,
  error: { code, message, status },
})

const refreshInFlight: Map<string, Promise<string | null>> = new Map()
const instances: Map<string, PuzzleAuthService> = new Map()

class PuzzleAuthService {
  private readonly origin: string
  private readonly config: PuzzleAuthConfig

  constructor(origin: string, config?: PuzzleAuthConfig) {
    this.origin = origin
    this.config = config ?? {}
  }

  public static forOrigin(origin: string): PuzzleAuthService {
    let instance = instances.get(origin)
    if (!instance) {
      instance = new PuzzleAuthService(origin)
      instances.set(origin, instance)
    }
    return instance
  }

  public getToken(): string | null {
    const tokenData = tokenStore.getTokenData(this.origin)
    if (!this.isValid(tokenData)) {
      this.invalidateToken()
      return null
    }
    return tokenData!.token
  }

  public invalidateToken(): void {
    tokenStore.clearTokenData(this.origin)
  }

  public async refreshToken(
    onProgress?: ProgressCallback,
    onStatus?: StatusCallback
  ): Promise<string | null> {
    const existingRefresh = refreshInFlight.get(this.origin)
    if (existingRefresh) return existingRefresh

    const refreshPromise = (async () => {
      const result = await this.generateJwtToken(onProgress, onStatus)

      if (result.success && result.token) {
        const tokenData: TokenData = {
          token: result.token,
          expiresAt: parseJwtExp(result.token) ?? 0,
          solveTime: result.solveTime,
          attempts: result.attempts,
        }
        tokenStore.setTokenData(this.origin, tokenData)
        return result.token
      }

      return null
    })().finally(() => {
      refreshInFlight.delete(this.origin)
    })

    refreshInFlight.set(this.origin, refreshPromise)
    return refreshPromise
  }

  public async ensureToken(
    onProgress?: ProgressCallback,
    onStatus?: StatusCallback
  ): Promise<string | null> {
    const existingToken = this.getToken()
    if (existingToken) return existingToken
    return this.refreshToken(onProgress, onStatus)
  }

  private isValid(tokenData: TokenData | null): boolean {
    if (!tokenData?.token) return false
    if (!tokenData.expiresAt) return false
    const buffer = this.config.expiryBuffer ?? DEFAULTS.expiryBuffer
    return Date.now() < tokenData.expiresAt - buffer
  }

  private async getPuzzle(): Promise<PuzzleAuthResult> {
    const puzzlePath = `${this.origin}/auth/puzzle`

    try {
      const response = await fetch(puzzlePath, {
        method: 'GET',
      })

      if (!response.ok) {
        return createError(
          'PUZZLE_FETCH_ERROR',
          `Failed to get puzzle: ${response.statusText}`,
          response.status
        )
      }

      return { success: true, puzzle: await response.json() }
    } catch (error) {
      return createError(
        'NETWORK_ERROR',
        error instanceof Error ? error.message : 'Unknown error'
      )
    }
  }

  private async submitSolution(solution: Solution): Promise<PuzzleAuthResult> {
    const solvePath = `${this.origin}/auth/solve`

    try {
      const response = await fetch(solvePath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(solution),
      })

      if (!response.ok) {
        return createError(
          'SOLUTION_SUBMIT_ERROR',
          `Failed to submit: ${response.statusText}`,
          response.status
        )
      }

      const data = await response.json()
      return { success: true, token: data.token }
    } catch (error) {
      return createError(
        'NETWORK_ERROR',
        error instanceof Error ? error.message : 'Unknown error'
      )
    }
  }

  private async generateJwtToken(
    onProgress?: ProgressCallback,
    onStatus?: StatusCallback
  ): Promise<PuzzleAuthResult> {
    try {
      onStatus?.('Getting puzzle...')
      const puzzleResult = await this.getPuzzle()

      if (!puzzleResult.success || !puzzleResult.puzzle) {
        return puzzleResult
      }

      onStatus?.('Solving puzzle...')
      const solveResult = await solvePuzzle(
        puzzleResult.puzzle,
        onProgress,
        this.config.maxSolveAttempts ?? DEFAULTS.maxAttempts
      )

      if (!solveResult.success || !solveResult.solution) {
        return solveResult
      }

      onStatus?.('Submitting solution...')
      const submitResult = await this.submitSolution(solveResult.solution)

      if (!submitResult.success) {
        return submitResult
      }

      return {
        success: true,
        token: submitResult.token,
        puzzle: puzzleResult.puzzle,
        solution: solveResult.solution,
        solveTime: solveResult.solveTime,
        attempts: solveResult.attempts,
      }
    } catch (error) {
      return createError(
        'GENERATE_TOKEN_ERROR',
        error instanceof Error ? error.message : 'Unknown error'
      )
    }
  }
}

export default PuzzleAuthService
