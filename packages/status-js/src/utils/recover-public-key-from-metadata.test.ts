import { recoverPublicKeyFromMetadata } from './recover-public-key-from-metadata'

import type { ApplicationMetadataMessage } from '~/protos/application-metadata-message'

describe('TODO: recoverPublicKeyFromMetadata', () => {
  it('should recover public key', async () => {
    const metadata: ApplicationMetadataMessage = {}
    expect(recoverPublicKeyFromMetadata(metadata)).toEqual({})
  })
})
