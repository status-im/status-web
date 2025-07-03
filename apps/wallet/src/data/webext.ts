import type { Runtime } from 'wxt/browser'

export type TRPCClientContextType = 'POPUP' | 'SIDE_PANEL' | 'PAGE' | 'TAB'

export function runtimePortToClientContextType(
  port?: Runtime.Port,
): TRPCClientContextType | undefined {
  const { origin } = globalThis.location
  if (!port) return
  if (port.sender?.url?.startsWith(`${origin}/sidepanel.html`))
    return 'SIDE_PANEL'
  if (port.sender?.url?.startsWith(`${origin}/popup.html`)) return 'POPUP'
  if (port.sender?.url?.startsWith(`${origin}/page.html`)) return 'PAGE'
  return 'TAB'
}
