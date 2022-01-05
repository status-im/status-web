import { ec } from "elliptic";
import { utils } from "js-waku";

const EC = new ec("secp256k1");

const hexToBuf = utils.hexToBuf;
export { hexToBuf };

/**
 * Return hex string with 0x prefix (commonly used for string format of a community id/public key.
 */
export function bufToHex(buf: Uint8Array): string {
  return "0x" + utils.bufToHex(buf);
}

export function compressPublicKey(key: Uint8Array): string {
  const PubKey = EC.keyFromPublic(key);
  return "0x" + PubKey.getPublic(true, "hex");
}
