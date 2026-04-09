import { storage } from '@wxt-dev/storage'

import { NOTIFICATIONS_ENABLED_KEY } from './storage-keys'

async function isEnabled(): Promise<boolean> {
  try {
    return (await storage.getItem<boolean>(NOTIFICATIONS_ENABLED_KEY)) ?? true
  } catch (error) {
    console.warn('Failed to read notification setting', error)
    return true
  }
}

export async function notifyTransactionSent(
  amount: string,
  asset: string,
): Promise<boolean> {
  try {
    if (!(await isEnabled())) return false
    await chrome.notifications.create({
      type: 'basic',
      iconUrl: chrome.runtime.getURL('icons/128.png'),
      title: 'Transaction Sent',
      message: `Sending ${amount} ${asset}…`,
    })
    return true
  } catch (error) {
    console.warn('Failed to create notification', error)
    return false
  }
}

export async function notifyTransactionConfirmed(
  amount: string,
  asset: string,
): Promise<boolean> {
  try {
    if (!(await isEnabled())) return false
    await chrome.notifications.create({
      type: 'basic',
      iconUrl: chrome.runtime.getURL('icons/128.png'),
      title: 'Transaction Confirmed',
      message: `${amount} ${asset} sent successfully`,
    })
    return true
  } catch (error) {
    console.warn('Failed to create notification', error)
    return false
  }
}

export async function notifyTransactionFailed(
  amount: string,
  asset: string,
): Promise<boolean> {
  try {
    if (!(await isEnabled())) return false
    await chrome.notifications.create({
      type: 'basic',
      iconUrl: chrome.runtime.getURL('icons/128.png'),
      title: 'Transaction Failed',
      message: `${amount} ${asset} transaction failed`,
    })
    return true
  } catch (error) {
    console.warn('Failed to create notification', error)
    return false
  }
}
