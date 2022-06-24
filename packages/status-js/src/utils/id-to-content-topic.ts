import { keccak256 } from 'ethereum-cryptography/keccak'
import { bytesToHex, utf8ToBytes } from 'ethereum-cryptography/utils'

/**
 * waku spec: https://rfc.vac.dev/spec/23/#bridging-waku-v1-and-waku-v2
 * status-go: https://github.com/status-im/status-go/blob/f6dc6f752a/wakuv2/common/topic.go#L66
 */

const TOPIC_LENGTH = 4

export function idToContentTopic(id: string): string {
  const hash = keccak256(utf8ToBytes(id))
  const topic = hash.slice(0, TOPIC_LENGTH)

  return `/waku/1/0x${bytesToHex(topic)}/rfc26`
}
