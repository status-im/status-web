'use server'

import { revalidatePath } from 'next/cache'

// import { redirect } from 'next/navigation'
import { api } from '~server/trpc/server'

import type { ApiInput } from '~server/api/types'

export async function createEpic(input: ApiInput['epics']['create']) {
  await api.epics.create(input)
  revalidatePath('/admin/insights/epics', 'layout')
  // redirect('/admin/insights/epics')
}

export async function updateEpic(input: ApiInput['epics']['update']) {
  await api.epics.update(input)
  revalidatePath('/admin/insights/epics', 'layout')
  revalidatePath(`/admin/insights/epics/${input.id}`)
  // redirect('/admin/insights/epics')
}

export async function deleteEpic(id: ApiInput['epics']['delete']['id']) {
  await api.epics.delete({ id })
  revalidatePath('/admin/insights/epics', 'layout')
  // redirect('/admin/insights/epics')
}
