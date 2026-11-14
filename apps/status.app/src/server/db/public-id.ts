import { customAlphabet } from 'nanoid'
import { z } from 'zod'

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz'
const length = 6

const nanoid = customAlphabet(alphabet, length)

export function publicId() {
  return nanoid()
}

export const publicIdSchema = z.string().length(10).refine(publicId, {
  message: 'Invalid public ID',
})

export type PublicId = z.infer<typeof publicIdSchema>
