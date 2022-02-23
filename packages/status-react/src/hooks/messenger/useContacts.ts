import {
  Contacts as ContactsClass,
  Identity,
  Messenger,
  bufToHex,
} from '@status-im/core'
import { useMemo, useReducer, useState } from 'react'

import { Contacts } from '../../models/Contact'

export type ContactsAction =
  | { type: 'updateOnline'; payload: { id: string; clock: number } }
  | { type: 'setTrueName'; payload: { id: string; trueName: string } }
  | {
      type: 'setCustomName'
      payload: { id: string; customName: string | undefined }
    }
  | {
      type: 'setIsUntrustworthy'
      payload: { id: string; isUntrustworthy: boolean }
    }
  | { type: 'setIsFriend'; payload: { id: string; isFriend: boolean } }
  | { type: 'setBlocked'; payload: { id: string; blocked: boolean } }
  | { type: 'toggleBlocked'; payload: { id: string } }
  | { type: 'toggleTrustworthy'; payload: { id: string } }

function contactsReducer(state: Contacts, action: ContactsAction): Contacts {
  const id = action.payload.id
  const prev = state[id]

  switch (action.type) {
    case 'updateOnline': {
      const now = Date.now()
      const clock = action.payload.clock
      if (prev) {
        return { ...state, [id]: { ...prev, online: clock > now - 301000 } }
      }
      return { ...state, [id]: { id, trueName: id.slice(0, 10) } }
    }
    case 'setTrueName': {
      const trueName = action.payload.trueName
      if (prev) {
        return { ...state, [id]: { ...prev, trueName } }
      }
      return { ...state, [id]: { id, trueName } }
    }
    case 'setCustomName': {
      const customName = action.payload.customName
      if (prev) {
        return { ...state, [id]: { ...prev, customName } }
      }
      return state
    }
    case 'setIsUntrustworthy': {
      const isUntrustworthy = action.payload.isUntrustworthy
      if (prev) {
        return { ...state, [id]: { ...prev, isUntrustworthy } }
      }
      return state
    }
    case 'setIsFriend': {
      const isFriend = action.payload.isFriend
      if (prev) {
        return { ...state, [id]: { ...prev, isFriend } }
      }
      return state
    }
    case 'setBlocked': {
      const blocked = action.payload.blocked
      if (prev) {
        return { ...state, [id]: { ...prev, blocked } }
      }
      return state
    }
    case 'toggleBlocked': {
      if (prev) {
        return { ...state, [id]: { ...prev, blocked: !prev.blocked } }
      }
      return state
    }
    case 'toggleTrustworthy': {
      if (prev) {
        return {
          ...state,
          [id]: { ...prev, isUntrustworthy: !prev.isUntrustworthy },
        }
      }
      return state
    }
    default:
      throw new Error()
  }
}

export function useContacts(
  messenger: Messenger | undefined,
  identity: Identity | undefined,
  newNickname: string | undefined
) {
  const [nickname, setNickname] = useState<string | undefined>(undefined)
  const [contacts, contactsDispatch] = useReducer(contactsReducer, {})

  const contactsClass = useMemo(() => {
    if (messenger && messenger.identity === identity) {
      const newContacts = new ContactsClass(
        identity,
        messenger.waku,
        (id, clock) =>
          contactsDispatch({ type: 'updateOnline', payload: { id, clock } }),
        (id, nickname) => {
          if (identity?.publicKey && id === bufToHex(identity.publicKey)) {
            setNickname(nickname)
          }
          contactsDispatch({
            type: 'setTrueName',
            payload: { id, trueName: nickname },
          })
        },
        newNickname
      )
      return newContacts
    }
  }, [messenger, identity, newNickname])

  return { contacts, contactsDispatch, contactsClass, nickname }
}
