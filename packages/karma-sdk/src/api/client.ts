export interface KarmaApiClientConfig {
  baseUrl: string
  fetch?: typeof globalThis.fetch
}

export class KarmaApiClient {
  private baseUrl: string
  private fetchFn: typeof globalThis.fetch

  constructor(config: KarmaApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '')
    this.fetchFn = config.fetch ?? globalThis.fetch.bind(globalThis)
  }

  async request<T>(path: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${path}`
    const response = await this.fetchFn(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new KarmaApiError(response.status, response.statusText, url)
    }

    return response.json()
  }
}

export class KarmaApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly url: string
  ) {
    super(`Karma API error ${status}: ${statusText} (${url})`)
    this.name = 'KarmaApiError'
  }
}
