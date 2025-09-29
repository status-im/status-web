'use server'

import { revalidatePath } from 'next/cache'

import { api } from '~server/trpc/server'

import type { ApiInput } from '~server/api/types'

export async function createWorkstream(
  data: ApiInput['workstreams']['create']
) {
  await api.workstreams.create(data)
  revalidatePath('/admin/insights/workstreams', 'layout')
}

export async function updateWorkstream(
  input: ApiInput['workstreams']['update']
) {
  await api.workstreams.update(input)
  revalidatePath(`/admin/insights/workstreams/${input.id}`)
  revalidatePath('/admin/insights/workstreams')
}

export async function deleteWorkstream(
  id: ApiInput['workstreams']['delete']['id']
) {
  await api.workstreams.delete({ id })
  revalidatePath('/admin/insights/workstreams', 'layout')
}

export async function updateWorkstreamProjects(
  input: ApiInput['workstreams']['updateProjects']
) {
  await api.workstreams.updateProjects(input)
  revalidatePath(`/admin/insights/workstreams/${input.id}`)
  revalidatePath('/admin/insights/workstreams')
}

export async function removeWorkstreamProject(
  input: ApiInput['workstreams']['removeProject']
) {
  await api.workstreams.removeProject(input)
  revalidatePath(`/admin/insights/workstreams/${input.workstreamId}`)
  revalidatePath('/admin/insights/workstreams')
}
