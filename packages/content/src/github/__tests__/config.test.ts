import assert from 'node:assert/strict'
import { afterEach, describe, it } from 'node:test'

import { __resetGithubConfigForTests, loadGithubConfigFromEnv } from '../config'

const originalEnv = { ...process.env }

const setBaseEnv = (): void => {
  process.env.GITHUB_OWNER = 'logos-co'
  process.env.GITHUB_REPO = 'logos-web'
  process.env.GITHUB_APP_ID = '12345'
  process.env.GITHUB_INSTALLATION_ID = '67890'
  delete process.env.GITHUB_TOKEN
}

afterEach(() => {
  process.env = { ...originalEnv }
  __resetGithubConfigForTests()
})

describe('loadGithubConfigFromEnv', () => {
  it('normalizes escaped newlines in the GitHub App private key', () => {
    setBaseEnv()
    process.env.GITHUB_APP_PRIVATE_KEY =
      '-----BEGIN RSA PRIVATE KEY-----\\nabc\\n-----END RSA PRIVATE KEY-----'

    const config = loadGithubConfigFromEnv()

    assert.equal(
      config.appPrivateKey,
      '-----BEGIN RSA PRIVATE KEY-----\nabc\n-----END RSA PRIVATE KEY-----'
    )
  })

  it('rejects incomplete private key values before creating Octokit', () => {
    setBaseEnv()
    process.env.GITHUB_APP_PRIVATE_KEY = '-----BEGIN RSA PRIVATE KEY-----'

    assert.throws(
      () => loadGithubConfigFromEnv(),
      /GITHUB_APP_PRIVATE_KEY must include the full PEM value/
    )
  })
})
