/**
 * source: @see https://github.com/status-im/communities-contracts#deployments
 * source: @see https://github.com/status-im/community-dapp/tree/master/packages/contracts#deployments
 */

// const development = {
//   5: {
//     CommunityOwnerTokenRegistry: '0x59510D0b235c75d7bCAEb66A420e9bb0edC976AE',
//   },
//   11155111: {
//     CommunityOwnerTokenRegistry: '0x98E0A38A9c198F9F49a4F6b49475aE0c92aBbB66',
//   },
//   420: {
//     CommunityOwnerTokenRegistry: '0x99F0Eeb7E9F1Da6CA9DDf77dD7810B665FD85750',
//   },
//   // 11155420: {
//   //   CommunityOwnerTokenRegistry: '0xfFa8A255D905c909379859eA45B959D090DDC2d4',
//   // },
//   // 421613: {
//   //   CommunityOwnerTokenRegistry: '0x9C84f9f9970B22E67f1B2BE46ABb1C09741FF7d7',
//   // },
//   421614: {
//     CommunityOwnerTokenRegistry: '0x9C84f9f9970B22E67f1B2BE46ABb1C09741FF7d7',
//   },
// }

const production = {
  1: {
    CommunityOwnerTokenRegistry: '0x898331B756EE1f29302DeF227a4471e960c50612',
  },
  10: {
    CommunityOwnerTokenRegistry: '0x0AF2c7d60E89a941D586216059814D1Cb4Bd4CAb',
  },
  42161: {
    CommunityOwnerTokenRegistry: '0x76352764590378011CAE677b50110Ae02eDE2b62',
  },
}
export const contracts = {
  development: production,
  preview: production,
  production,
}
