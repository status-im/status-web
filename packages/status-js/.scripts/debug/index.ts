// yarn install
// cd packages/status-js/
// DEBUG="*,-vite*,-connect:*" DEBUG_HIDE_DATE="0" DEBUG_COLORS="1" VITE_NODE="true" yarn vite-node .scripts/debug/index.ts

import { createRequestClient } from '../../src/request-client/request-client'
import { deserializePublicKey } from '../../src/utils/deserialize-public-key'

const requestClient = await createRequestClient({ environment: 'test' })

process.once('SIGTERM', async () => {
  await requestClient.stop()
})

process.once('SIGINT', async () => {
  await requestClient.stop()
})

const deserializedPublicKey = deserializePublicKey(
  // '0x0269e4e75683762fc5d8af53ee1d1656767b780519a5bd1ecb4bd34d482b100fd7'
  // '0x029f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb4542955133'
  'zQ3shf8EvhRKHSc3skgtupULuLdWh59S5czZkvS69P6rJ7aed'
  // 'zQ3shVhrvjfYRfh6unhUpapUNuVHh7BAL3Qx3G7oh6wkYDM7s'
)
const detail = await requestClient.fetchCommunityDescription(
  deserializedPublicKey
)

debugger
