import { spawn } from 'node:child_process'

import {
  createAutoSubmitState,
  isLocalSchemaPushAutomationAllowed,
  shouldSubmitDefaultSchemaChoice,
} from './schema-push-prompts'

if (!isLocalSchemaPushAutomationAllowed(process.env)) {
  console.error(
    [
      'Refusing to run the CMS dev schema-push wrapper in a deployment environment.',
      'Production and staging must use the build/start path with reviewed migrations, not local dev schema sync.',
    ].join(' ')
  )
  process.exit(1)
}

const child = spawn('next', ['dev', '--port', '3010'], {
  env: process.env,
  stdio: ['pipe', 'pipe', 'pipe'],
})

const state = createAutoSubmitState()
let recentOutput = ''

const handleOutput = (chunk: Buffer, stream: NodeJS.WriteStream): void => {
  const output = chunk.toString()
  stream.write(chunk)

  recentOutput = `${recentOutput}${output}`.slice(-4000)

  if (shouldSubmitDefaultSchemaChoice(recentOutput, state)) {
    child.stdin.write('\n')
  }
}

child.stdout.on('data', (chunk: Buffer) => {
  handleOutput(chunk, process.stdout)
})

child.stderr.on('data', (chunk: Buffer) => {
  handleOutput(chunk, process.stderr)
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 0)
})

const forwardSignal = (signal: NodeJS.Signals): void => {
  child.kill(signal)
}

process.on('SIGINT', forwardSignal)
process.on('SIGTERM', forwardSignal)
