'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export async function getDevice(id: string) {
  // Simulate fetching device data from the database
  const promise = new Promise(resolve => setTimeout(resolve, 500))

  const schema = z.object({
    id: z.string(),
  })

  const data = schema.parse({
    id,
  })

  try {
    await promise
    console.log('Fetching device with id:', data.id)
    return {
      data: {
        publicKey: '0x183912Ddd631317315C7bEa3bFE8919Da5f301F5',
        importedAt: '2021-01-01 12:00:00',
        firstVerifiedAt: '2021-01-01 12:00:00',
        verifications: 2,
        firmware: '1.0.12',
        database: '3',
        history: [
          {
            date: '2022-12-01 12:00:00',
            message: 'Device was successfully verified',
          },
          {
            date: '2021-08-04 12:00:00',
            message: 'Device was successfully verified',
          },
          {
            date: '2021-04-01 12:00:00',
            message: 'Device was successfully verified',
          },
          {
            date: '2021-01-27 12:00:00',
            message: 'Device was imported',
          },
        ],
      },
    }
  } catch {
    return { message: 'Failed to get device info' }
  }
}

export async function removeDevice(id: string) {
  // Simulate removing device from the database and return error message if it fails
  const promise = new Promise(resolve => setTimeout(resolve, 500))

  const schema = z.object({
    id: z.string(),
  })

  const data = schema.parse({
    id,
  })

  try {
    await promise
    console.log('Removed device with id:', data.id)
    revalidatePath('/admin/keycard/devices')
    return { message: 'Removed device' }
  } catch {
    return { message: 'Failed to remove device' }
  }
}
