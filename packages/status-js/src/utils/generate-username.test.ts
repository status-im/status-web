import { expect, test } from 'vitest'

import { generateUsername } from './generate-username'

test('should generate the username', () => {
  const publicKey1 =
    '0x04eedbaafd6adf4a9233a13e7b1c3c14461fffeba2e9054b8d456ce5f6ebeafadcbf3dce3716253fbc391277fa5a086b60b283daf61fb5b1f26895f456c2f31ae3'
  expect(generateUsername(publicKey1)).toBe('Darkorange Blue Bubblefish')

  const publicKey2 =
    '0x04ac419dac9a8bbb58825a3cde60eef0ee71b8cf6c63df611eeefc8e7aac7c79b55954b679d24cf5ec82da7ed921caf240628a9bfb3450c5111a9cffe54e631811'
  expect(generateUsername(publicKey2)).toBe('Bumpy Absolute Crustacean')

  const publicKey3 =
    '0x0403aeff2fdd0044b136e06afa6d69bb563bb7b3fd518bb30c0d5115a2e020840a2247966c2cc9953ed02cc391e8883b3319f63a31e5f5369d0fb72b62b23dfcbd'
  expect(generateUsername(publicKey3)).toBe('Back Careful Cuckoo')
})
