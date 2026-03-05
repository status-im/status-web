export class ProviderRpcError extends Error {
  public code: number
  public data: unknown

  constructor(args: { code: number; message: string; data?: unknown }) {
    super(args.message)
    this.code = args.code
    this.data = args.data
  }
}
