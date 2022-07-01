import React, { useState } from 'react'

import { QRCodeSVG } from 'qrcode.react'

import { styled } from '../../../../styles/config'
import { Box, ButtonGroup, Dialog, Text, TextInput } from '../../../../system'

export const SyncStatusProfileDialog = () => {
  const [platform, setPlatform] = useState<'mobile' | 'desktop'>('mobile')

  return (
    <Dialog title="Sync with Status profile">
      <Dialog.Body
        align="center"
        gap="6"
        css={{ paddingTop: 24, paddingBottom: 48 }}
      >
        <ButtonGroup value={platform} onChange={setPlatform}>
          <ButtonGroup.Item value="mobile">From Mobile</ButtonGroup.Item>
          <ButtonGroup.Item value="desktop">From Desktop</ButtonGroup.Item>
        </ButtonGroup>

        {platform === 'mobile' && (
          <>
            {/* TODO: Add mobile QR code */}
            <QRCodeSVG value="https://status.im/get/" size={158} />
            <Box>
              <List>
                {/* // TODO: Add icons to instructions */}
                <ListItem>1. Open Status App on your mobile</ListItem>
                <ListItem>2. Navigate yourself to tab</ListItem>
                <ListItem>3. Select</ListItem>
                <ListItem>4. Tap</ListItem>
                <ListItem>5. Scan the sync code from this screen ↑</ListItem>
              </List>
            </Box>
          </>
        )}

        {platform === 'desktop' && (
          <>
            <Box css={{ width: '100%' }}>
              <TextInput label="Sync Code" placeholder="0x000000" />
            </Box>
            <List>
              {/* TODO: Add icons to instructions */}
              <ListItem>1. Open Status App on your desktop</ListItem>
              <ListItem>2. Navigate yourself to tab</ListItem>
              <ListItem>3. Select</ListItem>
              <ListItem>4. Tap</ListItem>
              <ListItem>5. Scan the sync code from this screen ↑</ListItem>
            </List>
          </>
        )}
      </Dialog.Body>
    </Dialog>
  )
}

const List = styled('ul', {
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
})

const ListItem = styled('li', Text, {
  defaultVariants: {
    color: 'gray',
  },
})
