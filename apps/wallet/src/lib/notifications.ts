import { storage } from '@wxt-dev/storage'

import { NOTIFICATIONS_ENABLED_KEY } from './storage-keys'

async function isEnabled(): Promise<boolean> {
  return (await storage.getItem<boolean>(NOTIFICATIONS_ENABLED_KEY)) ?? true
}

export async function notifyTransactionSent(
  amount: string,
  asset: string,
): Promise<boolean> {
  if (!(await isEnabled())) return false
  try {
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
  if (!(await isEnabled())) return false
  try {
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
  if (!(await isEnabled())) return false
  try {
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
