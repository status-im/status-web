import { Buffer } from "buffer";

import { keccak256 } from "js-sha3";
import { generatePrivateKey } from "js-waku";
import * as secp256k1 from "secp256k1";

import { hexToBuf } from "./utils";

export class Identity {
  private pubKey: Uint8Array;
  public constructor(public privateKey: Uint8Array) {
    this.pubKey = secp256k1.publicKeyCreate(this.privateKey, true);
  }

  public static generate(): Identity {
    const privateKey = generatePrivateKey();
    return new Identity(privateKey);
  }

  /**
   * Hashes the payload with SHA3-256 and signs the result using the internal private key.
   */
  public sign(payload: Uint8Array): Uint8Array {
    const hash = keccak256(payload);
    const { signature, recid } = secp256k1.ecdsaSign(
      hexToBuf(hash),
      this.privateKey
    );

    return Buffer.concat([signature, Buffer.from([recid])]);
  }

  /**
   * Returns the compressed public key.
   */
  public get publicKey(): Uint8Array {
    return this.pubKey;
  }
}
