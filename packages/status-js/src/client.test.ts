import { createClient } from './client'

describe('Client', () => {
  it('', async () => {
    const client = await createClient({ publicKey: '' })
    await client.start()

    debugger
  })
})
