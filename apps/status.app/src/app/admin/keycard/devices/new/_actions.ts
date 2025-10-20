'use server'

import { FormDataSchema } from './schema'

import type { z } from 'zod'

type Inputs = z.infer<typeof FormDataSchema>

export async function addDevice(data: Inputs) {
  const result = FormDataSchema.safeParse(data)

  if (result.success) {
    return { success: true }
  }

  return { success: false, error: result.error.format() }
}
