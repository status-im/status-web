import { loadEnvConfig } from '@next/env'
import { rm, writeFile } from 'node:fs/promises'
import { cwd } from 'node:process'

import { blogMaintenanceHtml } from '../src/app/(website)/blog/_utils/maintenance-response'
import { isBlogInMaintenance } from '../src/config/blog-maintenance'

const output = new URL('../.next/static/blog-maintenance.html', import.meta.url)

async function main() {
  loadEnvConfig(cwd())

  if (!isBlogInMaintenance()) {
    await rm(output, { force: true })
    return
  }

  await writeFile(output, blogMaintenanceHtml)
}

void main()
