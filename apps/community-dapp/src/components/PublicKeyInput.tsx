import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Input } from './Input'
import { deserializePublicKey } from '@status-im/js'

type Props = {
  onPublicKeyChange: (val: string) => void
}

export function PublicKeyInput({ onPublicKeyChange }: Props) {
  const [value, setValue] = useState('')

  useEffect(() => {
    try {
      const publicKey = deserializePublicKey(value)
      console.log('valid', publicKey)
      onPublicKeyChange(publicKey)
    } catch (error) {
      console.log(error)
    }
  }, [value])

  return (
    <CommunityKeyLabel>
      Community public key
      <CommunityKey
        value={value}
        placeholder="E.g. zQ3shf8EvhRKHSc3skg7upULuLdWhS95SczZkuS69P6rJTaed"
        onChange={(e) => setValue(e.currentTarget.value)}
      />
    </CommunityKeyLabel>
  )
}

const CommunityKey = styled(Input)`
  width: 100%;
  margin-top: 10px;
  font-size: 15px;
  line-height: 22px;
`
const CommunityKeyLabel = styled.label`
  width: 100%;
  font-size: 15px;
  line-height: 22px;
`
