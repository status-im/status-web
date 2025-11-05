// Type definitions for @cap.js/widget
declare module '@cap.js/widget' {
  export class Cap {
    constructor(options: { apiEndpoint: string })
    solve(): Promise<string>
  }
}

// Extend global types for cap-widget custom element
declare namespace JSX {
  interface IntrinsicElements {
    'cap-widget': {
      'data-cap-api-endpoint'?: string
      'data-cap-worker-count'?: number
      'data-cap-hidden-field-name'?: string
      ref?: any
      className?: string
      style?: any
    }
  }
}

declare global {
  interface CapSolveEvent extends Event {
    detail: {
      token: string
    }
  }

  interface CapErrorEvent extends Event {
    detail: {
      error: Error
    }
  }

  interface CapProgressEvent extends Event {
    detail: {
      progress: number
    }
  }
}
