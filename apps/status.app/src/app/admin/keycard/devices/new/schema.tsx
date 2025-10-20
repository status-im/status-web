import { z } from 'zod'

export const FormDataSchema = z.object({
  uid: z
    .string()
    .nonempty('UID is required')
    .min(6, { message: 'UID must be at least 6 characters.' }),
  publicKey: z
    .string()
    .nonempty('Public key is required.')
    .min(6, { message: 'Message must be at least 6 characters.' }),
})
