import { Buffer } from "buffer";

import { keccak256 } from "js-sha3";

const TopicLength = 4;

export function chatIdToContentTopic(chatId: string): string {
  const hash = keccak256.arrayBuffer(chatId);

  const topic = Buffer.from(hash).slice(0, TopicLength);

  return "/waku/1/" + "0x" + topic.toString("hex") + "/rfc26";
}
