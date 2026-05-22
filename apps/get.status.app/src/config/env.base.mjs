/** *
 * @param {import('zod').ZodError} error
 */
export function handleError(error) {
  const failedVariables = error.errors
    .filter(
      error =>
        error.message === 'Required' || error.message.startsWith('Invalid')
    )
    .map(error => error.path[0])

  if (!failedVariables.length) {
    console.error(error)

    return
  }

  console.error(
    '❌ Missing or otherwise invalid environment variables:',
    failedVariables.join(', ')
  )
  console.info(
    'ℹ️ Copy .env.example to .env.local and fill in the values you need.'
  )
}
