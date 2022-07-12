/**
 * Examples:
 * - search for keywords in repositories of imported packages in this file
 * - https://github.com/vitest-dev/vitest/blob/main/examples/puppeteer/test/basic.test.ts (preview, puppeteer)
 * - https://github.com/vitest-dev/vitest/blob/main/examples/lit/test/basic.test.ts (happy-dom)
 * - https://github.com/vitest-dev/vitest/blob/main/examples/nextjs/__tests__/Home.test.tsx (render)
 * - https://github.com/vitest-dev/vitest/blob/main/examples/react-mui/test/testUtils.tsx (render)
 * - https://github.com/vitest-dev/vitest/blob/main/examples/react-storybook/src/App.test.tsx (render, screen)
 * - https://github.com/vitest-dev/vitest/blob/main/examples/react-enzyme/test/Button.test.tsx (shallow render)
 * - https://github.com/vitest-dev/vitest/blob/main/examples/solid/test/Hello.test.jsx#L9 (fireEvent, render)
 * - https://github.com/vitest-dev/vitest/blob/main/examples/react/test/basic.test.tsx (renderer)
 * - https://github.com/vitest-dev/vitest/blob/main/examples/ruby/test/components/Test.spec.ts (mount)
 * - https://github.com/vitest-dev/vitest/blob/main/examples/vue-jsx/test/case.test.ts#L15 (shallowMount)
 * - https://github.com/vitest-dev/vitest/blob/main/examples/vue/test/async.test.ts#L17 (nextTick, flushPromises)
 */

// TODO!: mock js-waku
// TODO: remove headless config
// TODO: remove page.pause()
// TODO: remove timeouts
// TODO?: remove comments
// TODO?: other browsers
// FIXME: run from editor, not just cli
// TODO?: nest in describe
// TODO?!: test unmount (to gracefully disconnect from waku)
// TODO?: mount match snapshot

import { chromium /*, firefox, webkit */ } from 'playwright'
import { preview } from 'vite'
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  expect,
  test,
  vi,
} from 'vitest'

import type { Browser, Page } from 'playwright'
import type { PreviewServer } from 'vite'

vi.mock('js-waku', () => {
  // const Waku = () => console.log('mock')
  const Waku = vi.fn()

  // Client.prototype.connect = vi.fn()
  // Client.prototype.query = vi.fn()
  // Client.prototype.end = vi.fn()

  return { Waku }
})

vi.mock('@status-im/js', () => {
  const createClient = vi.fn()

  return { createClient }
})

let server: PreviewServer
let browser: Browser
let page: Page

beforeAll(async () => {
  server = await preview({ preview: { port: 3001 } })
  // browser = await chromium.launch()
  browser = await chromium.launch({ headless: false })
})

afterAll(async () => {
  await browser.close()
  await server.httpServer.close()
})

beforeEach(async () => {
  page = await browser.newPage()
})

afterEach(async () => {
  await page.close()

  vi.clearAllMocks()
})

// test.only(
//   'record',
//   async () => {
//     await page.pause()
//   },
//   30 * 60 * 1000
// )

test('page title', async () => {
  await page.goto('http://localhost:3001')

  expect(await page.title()).toBe('Status Communities')
})

// TODO!: fixture chat(s)
// TODO!: fixture message(s)
test.only(
  'receiving message',
  async () => {
    await page.goto('http://localhost:3001')

    // Click text=t#test-messages
    await page
      .locator('text=t#test-messages')
      .click({ timeout: 15 * 60 * 1000 })
    await page.waitForURL(
      'http://localhost:3001/30804ea7-bd66-4d5d-91eb-b2dcfe2515b3'
    )

    // TODO!: expect a message

    await page.pause()
  },
  30 * 60 * 1000
)

// TODO!: mock community.requestToJoin()
test('sending message', async () => {
  await page.goto('http://localhost:3001')

  // Click text=Use Throwaway Profile
  await page.locator('text=Use Throwaway Profile').click()

  // Click text=t#test-messages
  await page.locator('text=t#test-messages').click()
  await page.waitForURL(
    'http://localhost:3001/30804ea7-bd66-4d5d-91eb-b2dcfe2515b3'
  )

  // Click [placeholder="Message"]
  await page.locator('[placeholder="Message"]').click()

  // Fill [placeholder="Message"]
  await page.locator('[placeholder="Message"]').fill('help')

  // Press Enter
  await page.locator('[placeholder="Message"]').press('Enter')

  // TODO!: expect "help" message
})

test('replying to message', async () => {
  await page.goto('http://localhost:3001')

  // Click text=t#test-messages
  await page.locator('text=t#test-messages').click()
  await page.waitForURL(
    'http://localhost:3001/30804ea7-bd66-4d5d-91eb-b2dcfe2515b3'
  )

  // Click text=Use Throwaway Profile
  await page.locator('text=Use Throwaway Profile').click()
  // Click [aria-label="Reply to message"]
  await page.locator('[aria-label="Reply to message"]').click()
  // Click [placeholder="Message"]
  await page.locator('[placeholder="Message"]').click()
  // Fill [placeholder="Message"]
  await page.locator('[placeholder="Message"]').fill('thx')
  // Press Enter
  await page.locator('[placeholder="Message"]').press('Enter')

  // TODO!: expect reply with reference to original message
})

test('reacting to message', async () => {
  await page.goto('http://localhost:3001')

  // Click text=t#test-messages
  await page.locator('text=t#test-messages').click()
  await page.waitForURL(
    'http://localhost:3001/30804ea7-bd66-4d5d-91eb-b2dcfe2515b3'
  )

  // Click text=Use Throwaway Profile
  await page.locator('text=Use Throwaway Profile').click()

  // Click text=BBumpy Absolute Crustacean12:40read docsPick reactionReply to message >> [aria-label="Pick reaction"]
  await page
    .locator(
      'text=BBumpy Absolute Crustacean12:40read docsPick reactionReply to message >> [aria-label="Pick reaction"]'
    )
    .click()

  // Click [aria-label="React with 👍️"]
  await page.locator('[aria-label="React with 👍️"]').click()

  // TODO!: expect a message with reaction
})
