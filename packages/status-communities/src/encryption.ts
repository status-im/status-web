import { kdf } from "ecies-geth";

const AESKeyLength = 32; // bytes

export async function createSymKeyFromPassword(
  password: string
): Promise<Uint8Array> {
  return kdf(Buffer.from(password, "utf-8"), AESKeyLength);
}
