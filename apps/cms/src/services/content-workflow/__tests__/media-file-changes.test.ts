import { mkdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import assert from 'node:assert/strict'
import { afterEach, describe, it } from 'node:test'

import { collectReferencedCmsUploadChanges } from '../media-file-changes'

const publicRoot = join(process.cwd(), 'tmp-media-test-public')

afterEach(async () => {
  await rm(publicRoot, { recursive: true, force: true })
})

describe('collectReferencedCmsUploadChanges', () => {
  it('adds one binary FileChange per referenced CMS upload path', async () => {
    await mkdir(join(publicRoot, 'cms/uploads'), { recursive: true })
    await writeFile(join(publicRoot, 'cms/uploads/hero.webp'), 'fake-image')

    const changes = await collectReferencedCmsUploadChanges({
      changes: [
        {
          path: 'content/pages/en/home.json',
          content: JSON.stringify({
            sections: [
              {
                image: {
                  src: '/cms/uploads/hero.webp',
                  alt: 'Hero',
                },
              },
              {
                duplicate: '/cms/uploads/hero.webp',
              },
            ],
          }),
        },
      ],
      publicRoot,
    })

    assert.equal(changes.length, 1)
    assert.deepEqual(changes[0], {
      path: 'apps/web/public/cms/uploads/hero.webp',
      content: Buffer.from('fake-image'),
    })
  })

  it('throws when a referenced CMS upload is missing from the public directory', async () => {
    await assert.rejects(
      collectReferencedCmsUploadChanges({
        changes: [
          {
            path: 'content/pages/en/home.json',
            content: JSON.stringify({ src: '/cms/uploads/missing.webp' }),
          },
        ],
        publicRoot,
      }),
      /referenced CMS upload is missing/
    )
  })
})
