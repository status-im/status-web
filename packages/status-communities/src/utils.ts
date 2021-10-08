import { utils } from "js-waku";

const hexToBuf = utils.hexToBuf;
export { hexToBuf };

/**
 * Return hex string with 0x prefix (commonly used for string format of a community id/public key.
 */
export function bufToHex(buf: Uint8Array): string {
  return "0x" + utils.bufToHex(buf);
}
