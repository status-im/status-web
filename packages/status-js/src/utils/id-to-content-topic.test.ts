import { expect, test } from 'vitest'

import { idToContentTopic } from './id-to-content-topic'

test('should return content topic', () => {
  expect(idToContentTopic).toBeDefined()
})
