export interface Argon2Params {
  memory_kb: number
  time: number
  threads: number
  key_len: number
}

export interface Puzzle {
  challenge: string
  salt: string
  difficulty: number
  argon2_params: Argon2Params
  hmac: string
  expires_at: number
  debug_solution?: { nonce: number; argon_hash: string }
}

export interface Solution {
  challenge: string
  salt: string
  nonce: number
  argon_hash: string
  hmac: string
  expires_at: number
}

export interface PuzzleAuthError {
  message: string
  status?: number
  code?: string
}

export interface PuzzleAuthResult {
  success: boolean
  token?: string
  puzzle?: Puzzle
  solution?: Solution
  solveTime?: number
  attempts?: number
  error?: PuzzleAuthError
}

export interface PuzzleAuthConfig {
  maxSolveAttempts?: number
  expiryBuffer?: number
}

export interface TokenData {
  token: string
  expiresAt: number
  solveTime?: number
  attempts?: number
}

export type ProgressCallback = (attempts: number, maxAttempts: number) => void
export type StatusCallback = (status: string) => void
