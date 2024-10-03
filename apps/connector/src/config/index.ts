export const config = {
  desktop: {
    rpc: {
      url: 'ws://localhost:8586',
      method: 'connector_callRPC',
    },
    downloadUrls: {
      macos: {
        silicon:
          'https://status.app/api/download/macos-silicon?source=connector',
        intel: 'https://status.app/api/download/macos-intel?source=connector',
      },
      windows: 'https://status.app/api/download/windows?source=connector',
      linux: 'https://status.app/api/download/linux?source=connector',
    },
  },
}
