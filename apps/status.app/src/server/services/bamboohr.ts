import 'server-only'

import { z } from 'zod'

import { serverEnv } from '~/config/env.server.mjs'

const responseSchema = z.object({
  employees: z.array(z.unknown()),
})

const employeeSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  workEmail: z.string(),
  jobTitle: z.string(),
  department: z.string(),
  supervisor: z.string(),
  supervisorEId: z.string(),
  supervisorEmail: z.string(),
  division: z.string(),
  team: z.string(),

  customGitHubusername: z.nullable(z.string()),
})

export type Contributor = z.infer<typeof employeeSchema>

export async function getContributors(): Promise<Contributor[]> {
  const response = await fetch(
    'https://api.bamboohr.com/api/gateway.php/statusim/v1/reports/custom?onlyCurrent=true&format=JSON',
    {
      method: 'POST',
      next: {
        revalidate: 86400, // 24 hours
      },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${serverEnv.BAMBOOHR_API_KEY}:x`)}`,
      },
      body: JSON.stringify({
        title: 'GET detailed employees',
        fields: [
          'displayName',
          'firstName',
          'lastName',
          'workEmail',
          'photoUrl',
          'id',
          'jobTitle',
          'department',
          'supervisor',
          'customGitHubusername',
          'division',
          'team',
          'supervisorEId',
          'supervisorEmail',
        ],
      }),
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch contributors')
  }

  const employees: Contributor[] = []
  for (const employee of responseSchema.parse(await response.json())
    .employees) {
    const employeeRecord = employeeSchema.safeParse(employee)

    if (!employeeRecord.success) {
      console.warn(
        'Invalid employee record:',
        `Employee (https://statusim.bamboohr.com/employees/employee.php?id=${
          z.object({ id: z.string() }).parse(employee).id
        }) has invalid fields (${employeeRecord.error.errors
          .map(error => error.path[0])
          .join(', ')})`
      )

      continue
    }

    employees.push(employeeRecord.data)
  }

  return employees
}
