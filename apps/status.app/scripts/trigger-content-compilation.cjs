#!/usr/bin/node

// const fs = require('node:fs')
const child_process = require('node:child_process')
const process = require('node:process')

process.once('SIGINT', () => {
  process.kill(process.pid, 'SIGKILL')
})

// trigger contentlayer build for content changes (incl. front-matter)
child_process.spawnSync('pnpm', ['build:content'], {
  stdio: 'inherit',
})

// // trigger Next.js refresh for content changes (excl. front-matter but faster)
// fs.utimesSync('.env', new Date(), new Date())
