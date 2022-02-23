import { BN } from "bn.js";
import { derive } from "ecies-geth";
import { ec } from "elliptic";
import { bufToHex } from "js-waku/build/main/lib/utils";

import { idToContentTopic } from "./contentTopic";
import { hexToBuf } from "./utils";

import { Identity } from ".";

const EC = new ec("secp256k1");
const partitionsNum = new BN(5000);

/**
 * Get the partitioned topic https://specs.status.im/spec/3#partitioned-topic
 * @param publicKey Public key of recipient
 * @returns string The Waku v2 Content Topic.
 */
export function getPartitionedTopic(publicKey: string): string {
  const key = EC.keyFromPublic(publicKey.slice(2), "hex");
  const X = key.getPublic().getX();

  const partition = X.mod(partitionsNum);

  const partitionTopic = `contact-discovery-${partition.toString()}`;

  return idToContentTopic(partitionTopic);
}

/**
 * Get the negotiated topic https://specs.status.im/spec/3#negotiated-topic
 * @param identity identity of user
 * @param publicKey Public key of recipient
 * @returns string The Waku v2 Content Topic.
 */
export async function getNegotiatedTopic(
  identity: Identity,
  publicKey: string
): Promise<string> {
  const key = EC.keyFromPublic(publicKey.slice(2), "hex");
  const sharedSecret = await derive(
    Buffer.from(identity.privateKey),
    hexToBuf(key.getPublic("hex"))
  );
  return idToContentTopic(bufToHex(sharedSecret));
}
