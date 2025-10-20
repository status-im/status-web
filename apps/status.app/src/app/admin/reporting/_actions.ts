'use server'

import { revalidatePath } from 'next/cache'

import { api } from '~server/trpc/server'

import type { ApiInput } from '~server/api/types'

export async function createReport(input: ApiInput['reports']['create']) {
  await api.reports.create(input)
  revalidatePath('/admin/reporting', 'layout')
}

export async function updateReport(input: ApiInput['reports']['update']) {
  await api.reports.update(input)
  revalidatePath('/admin/reporting', 'layout')
  revalidatePath(`/admin/reporting/${input.id}`)
}
