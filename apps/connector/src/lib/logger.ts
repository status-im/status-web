/* eslint-disable no-console */

export const logger = {
  info(message: unknown, ...args: unknown[]) {
    log('info', message, ...args)
  },

  warn(message: unknown, ...args: unknown[]) {
    log('warn', message, ...args)
  },

  error(message: unknown, ...args: unknown[]) {
    log('error', message, ...args)
  },
}

function log(
  level: 'info' | 'warn' | 'error',
  message: unknown,
  ...args: unknown[]
) {
  // service worker context
  if (
    typeof window === 'undefined' && // !window throws
    typeof self !== 'undefined' &&
    self.registration
  ) {
    chrome.storage.sync.get('status:logging').then(result => {
      if (!(result['status:logging'] === 'true')) {
        return
      }

      // async logging
      console[level]('status:connector:', message, ...args)
    })

    return
  }

  // other extension contexts
  if (!(window?.localStorage.getItem('status:logging') === 'true')) {
    return
  }

  // synchronous logging
  console[level]('status:connector:', message, ...args)
}
