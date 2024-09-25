#!/usr/bin/node

// todo: remove after adding `"type": "module",` to `package.json`
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-var-requires */

const child_process = require('node:child_process')
const process = require('node:process')

const subprocess = child_process.spawn('yarn', ['storybook:dev', '--no-open'], {
  detached: true,
  stdio: 'inherit',
})

process.once('SIGINT', () => {
  process.kill(-subprocess.pid, 'SIGKILL')
})
