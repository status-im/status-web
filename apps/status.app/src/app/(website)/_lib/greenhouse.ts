import { serverEnv } from '~/config/env.server.mjs'

type QuestionType =
  | 'input_text'
  | 'textarea'
  | 'input_file'
  | 'multi_value_single_select'
  | 'multi_value_multi_select'

type Question = {
  description: string | null
  label: string
  required: boolean
  fields: Array<{
    name: string
    type: QuestionType
    values: Array<{
      value: string
      label: string
    }>
  }>
}

export type Job = {
  id: number
  internal_job_id: number
  title: string
  updated_at: Date
  requisition_id: string
  location: {
    name: string
  }
  absolute_url: string
  metadata: unknown
  content: string
  departments: Department[]
  offices: Office[]
  questions: Question[]
}

type Department = {
  id: number
  name: string
  parent_id: number
  childIds: number[]
}

type Office = {
  id: number
  name: string
  location: string
  parent_id: number
  child_ids: number[]
}

type Jobs = {
  jobs: Job[]
  meta: {
    total: number
  }
}

const headers: RequestInit['headers'] = {
  'Content-Type': 'application/json',
}

const GREENHOUSE_API_URL = 'https://boards-api.greenhouse.io/v1/boards'

const emptyJobs: Jobs = {
  jobs: [],
  meta: {
    total: 0,
  },
}

const isJob = (value: unknown): value is Job =>
  typeof value === 'object' &&
  value !== null &&
  !('error' in value) &&
  'id' in value &&
  'title' in value &&
  'content' in value &&
  'location' in value &&
  typeof (value as Job).location === 'object' &&
  (value as Job).location !== null &&
  'name' in (value as Job).location

export const getStatusJob = async (id: string): Promise<Job | null> => {
  try {
    const response = await fetch(
      `${GREENHOUSE_API_URL}/${serverEnv.GREENHOUSE_STATUS_BOARD_ID}/jobs/${id}?questions=true`,
      {
        headers,
        next: {
          revalidate: 300, // 5 minutes
        },
      }
    )

    if (!response.ok) {
      return null
    }

    const job = await response.json()

    return isJob(job) ? job : null
  } catch (error) {
    console.error(
      `Failed to fetch status job ${id} from Greenhouse API:`,
      error
    )
    return null
  }
}
export const getStatusJobs = async (): Promise<Jobs> => {
  try {
    const response = await fetch(
      `${GREENHOUSE_API_URL}/${serverEnv.GREENHOUSE_STATUS_BOARD_ID}/jobs?content=true`,
      {
        headers,
        next: {
          revalidate: 300, // 5 minutes,
        },
      }
    )

    if (!response.ok) {
      return emptyJobs
    }

    const data = await response.json()

    if (!Array.isArray(data?.jobs)) {
      return emptyJobs
    }

    return data
  } catch (error) {
    console.error('Failed to fetch status jobs from Greenhouse API:', error)
    return emptyJobs
  }
}

export const getLogosJobs = async (): Promise<Jobs> =>
  await fetch(
    `${GREENHOUSE_API_URL}/${serverEnv.GREENHOUSE_LOGOS_BOARD_ID}/jobs?content=true`,
    {
      headers,
      next: {
        revalidate: 300, // 5 minutes
      },
    }
  ).then(res => res.json())

export const submitApplication = async (id: string, body: BodyInit) =>
  await fetch(
    `${GREENHOUSE_API_URL}/${serverEnv.GREENHOUSE_STATUS_BOARD_ID}/jobs/${id}`,
    {
      method: 'POST',
      headers: {
        ...headers,
        Authorization: `Basic ${btoa(serverEnv.GREENHOUSE_API_KEY)}`,
      },
      body,
    }
  ).then(res => res.json())
