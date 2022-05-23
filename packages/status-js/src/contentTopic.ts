import { Buffer } from 'buffer'
import { keccak256 } from 'js-sha3'

const TopicLength = 4

/**
 * Get the content topic of for a given Chat or Community
 * @param id The Chat id or Community id (hex string prefixed with 0x).
 * @returns string The Waku v2 Content Topic.
 */
export function idToContentTopic(id: string): string {
  const hash = keccak256.arrayBuffer(id)

  const topic = Buffer.from(hash).slice(0, TopicLength)

  return '/waku/1/' + '0x' + topic.toString('hex') + '/rfc26'
}

export function idToContactCodeTopic(id: string): string {
  return idToContentTopic(id + '-contact-code')
}
