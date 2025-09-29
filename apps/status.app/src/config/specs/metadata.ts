// todo: move to `contentlayer.config.ts` and recreate it from generated `SpecsDoc`
// with only selected fields needed instead
// fixme?: do not capitalize (ditto /help discussion)
export const METADATA: Record<
  string,
  {
    id: number | 'raw'
    fileName: string
    // overview?: boolean
    title?: string
    // order?: number
  }
> = {
  '24/STATUS-CURATION': {
    id: 24,
    fileName: 'curation.md',
  },
  '28/STATUS-FEATURING': {
    id: 28,
    fileName: 'featuring.md',
  },
  // fixme: Missing required fields for 1 documents. (slug)
  // fixme: Title still has ID despite being raw
  '57/STATUS-Simple-Scaling': {
    id: 'raw',
    fileName: 'simple-scaling.md',
  },
  // 'STATUS-MVDS-USAGE': {
  //   id: 'raw',
  //   fileName: 'status-mvds.md',
  // },
  // 'STATUS-WAKU2-USAGE': {
  //   id: 'raw',
  //   fileName: 'status-waku-usage.md',
  // },
  '61/STATUS-Community-History-Service': {
    id: 61,
    fileName: 'community-history-service.md',
  },
  '63/STATUS-Keycard-Usage': {
    id: 63,
    fileName: 'keycard-usage.md',
  },
  // todo?: rename title to 55/STATUS-1-TO-1-CHAT (in upstream as well)
  '55/STATUS-1TO1-CHAT': {
    id: 55,
    title: 'Status 1 to 1 Chat',
    fileName: '1to1-chat.md',
  },
  '56/STATUS-COMMUNITIES': {
    id: 56,
    fileName: 'communities.md',
  },
  '65/STATUS-ACCOUNT-ADDRESS': {
    id: 65,
    fileName: 'account-address.md',
  },
  '62/STATUS-PAYLOADS': {
    id: 62,
    fileName: 'payloads.md',
  },
  // '71/STATUS-PUSH-NOTIFICATION-SERVER': {
  //   id: 71,
  //   fileName: 'push-notification-server.md',
  // },
}
