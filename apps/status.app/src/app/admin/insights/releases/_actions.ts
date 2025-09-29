'use server'

import { revalidatePath } from 'next/cache'

import { api } from '~server/trpc/server'

import type { ApiInput } from '~server/api/types'

export async function updateReleaseMilestones(
  input: ApiInput['releases']['updateMilestones']
) {
  const release = await api.releases.updateMilestones(input)
  revalidatePath(`/admin/insights/releases/${release.platform}/${release.id}`)
  revalidatePath('/admin/insights/releases', 'layout')
}

export async function removeReleaseMilestone(
  input: ApiInput['releases']['removeMilestone']
) {
  await api.releases.removeMilestone(input)
  revalidatePath('/admin/insights/releases', 'layout')
}
