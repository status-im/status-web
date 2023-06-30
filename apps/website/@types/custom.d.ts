type ApiError = {
  extensions: { code?: string; [key: string]: string }
  locations: { column: number; line: number }[]
  message: string
  path: string[]
}

declare interface GraphqlApiError {
  response?: {
    errors?: ApiError[]
  }
}
