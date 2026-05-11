/**
 * Pads a hex string to an even length.
 */
export const padHex = (hexStr: string): string => {
  hexStr = hexStr.replace(/^0x/, '')
  return hexStr.length % 2 === 1 ? '0' + hexStr : hexStr
}
