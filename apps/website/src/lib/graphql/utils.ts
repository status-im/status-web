export const catchApiError = (
  error: GraphqlApiError,
  callback: (codes: string[]) => void
) => {
  const codes: string[] = []

  error.response?.errors?.forEach(error => {
    if (error.extensions?.code) {
      codes.push(error.extensions?.code)
    }
  })

  return callback(codes)
}
