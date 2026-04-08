import { argon2id } from 'hash-wasm'

import type {
  ProgressCallback,
  Puzzle,
  PuzzleAuthResult,
  Solution,
} from './types'

const hexToUint8Array = (hex: string): Uint8Array => {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16)
  }
  return bytes
}

const checkDifficulty = (hash: string, difficulty: number): boolean => {
  if (hash.length < difficulty) return false
  for (let i = 0; i < difficulty; i++) {
    if (hash[i] !== '0') return false
  }
  return true
}

export const solvePuzzle = async (
  puzzle: Puzzle,
  onProgress?: ProgressCallback,
  maxAttempts: number = 100000
): Promise<PuzzleAuthResult> => {
  const startTime = Date.now()

  try {
    const { challenge, salt, difficulty, argon2_params } = puzzle
    const saltBytes = hexToUint8Array(salt)

    for (let nonce = 0; nonce < maxAttempts; nonce++) {
      const input = `${challenge}${salt}${nonce}`

      try {
        const argonHash = await argon2id({
          password: input,
          salt: saltBytes,
          parallelism: argon2_params.threads,
          iterations: argon2_params.time,
          memorySize: argon2_params.memory_kb,
          hashLength: argon2_params.key_len,
          outputType: 'hex',
        })

        if (checkDifficulty(argonHash, difficulty)) {
          const solveTime = (Date.now() - startTime) / 1000

          const solution: Solution = {
            challenge,
            salt,
            nonce,
            argon_hash: argonHash,
            hmac: puzzle.hmac,
            expires_at: puzzle.expires_at,
          }

          return {
            success: true,
            solution,
            solveTime: parseFloat(solveTime.toFixed(2)),
            attempts: nonce + 1,
          }
        }
      } catch (error) {
        console.error('Argon2 computation error:', error)
        continue
      }

      if (nonce % 1000 === 0 && onProgress) {
        onProgress(nonce, maxAttempts)
        await new Promise(resolve => setTimeout(resolve, 1))
      }
    }

    return {
      success: false,
      error: {
        message: `Failed to solve puzzle within ${maxAttempts} attempts`,
        code: 'MAX_ATTEMPTS_EXCEEDED',
      },
    }
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : 'Unknown solver error',
        code: 'SOLVER_ERROR',
      },
    }
  }
}
