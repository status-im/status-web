import React, { useState } from 'react'

import { styled } from '../../../../styles/config'
import { Dialog, Grid, Text } from '../../../../system'

// TODO: Add wallet integration
export const ConnectWalletDialog = () => {
  const [, setWallet] = useState<'coinbase' | undefined>()

  // TODO: Add wallet logos
  return (
    <Dialog title="Connect Ethereum Wallet">
      <Dialog.Body>
        <Text css={{ marginBottom: '$3' }}>
          Choose a way to chat using your Ethereum address.
        </Text>
        <Grid gap={2} css={{ paddingBottom: '$2' }}>
          <ButtonItem>WalletConnect</ButtonItem>
          <ButtonItem onClick={() => setWallet('coinbase')}>
            Coinbase Wallet
          </ButtonItem>
          <ButtonItem>MetaMask</ButtonItem>
        </Grid>
      </Dialog.Body>
    </Dialog>
  )
}

// const CoinbaseWalletDialog = () => {
//   return (
//     <Dialog title="Connect with Coinbase Wallet">
//       <Dialog.Body>
//         <Text>Scan QR code or copy and pase it in your Coinbase Wallet.</Text>
//       </Dialog.Body>
//     </Dialog>
//   )
// }

// const WalletConnectDialog = () => {
//   return (
//     <Dialog title="Connect with WalletConnect">
//       <Dialog.Body>
//         <Text>
//           Scan QR code with a WallectConnect-compatible wallet or copy code and
//           paste it in your hardware wallet.
//         </Text>
//       </Dialog.Body>
//     </Dialog>
//   )
// }

const ButtonItem = styled('button', {
  width: '100%',
  padding: '12px 16px',
  textAlign: 'left',
  border: '1px solid $gray-3',
  borderRadius: '$2',
  color: '$accent-1',
  fontSize: 17,
  lineHeight: 1.5,
  fontWeight: '$600',

  '&:hover': {
    backgroundColor: '$primary-3',
  },
})
