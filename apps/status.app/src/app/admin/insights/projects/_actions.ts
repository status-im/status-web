'use server'

import { revalidatePath } from 'next/cache'

import { api } from '~server/trpc/server'

import type { ApiInput } from '~server/api/types'

export async function createProject(data: ApiInput['projects']['create']) {
  await api.projects.create(data)
  revalidatePath('/admin/insights/projects', 'layout')
  // redirect('/admin/insights/projects')
}

export async function updateProject(input: ApiInput['projects']['update']) {
  await api.projects.update(input)
  revalidatePath(`/admin/insights/projects/${input.id}`)
  revalidatePath('/admin/insights/projects/new')
  // redirect('/admin/insights/projects')
}

export async function deleteProject(id: ApiInput['projects']['delete']['id']) {
  await api.projects.delete({ id })
  revalidatePath('/admin/insights/projects', 'layout')
}

export async function createProjectMilestone(
  input: ApiInput['projects']['createMilestone']
) {
  await api.projects.createMilestone(input)
  revalidatePath('/admin/insights/projects', 'layout')
}

export async function updateProjectMilestone(
  input: ApiInput['projects']['updateMilestone']
) {
  await api.projects.updateMilestone(input)
  revalidatePath('/admin/insights/projects/new')
  revalidatePath('/admin/insights/projects', 'layout')
}

export async function deleteProjectMilestone(
  input: ApiInput['projects']['deleteMilestone']
) {
  await api.projects.deleteMilestone(input)
  revalidatePath('/admin/insights/projects', 'layout')
}

export async function updateProjectPosition(
  input: ApiInput['projects']['updatePosition']
) {
  await api.projects.updatePosition(input)
  revalidatePath('/admin/insights/projects', 'layout')
}
