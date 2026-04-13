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

async function createNotification(
  title: string,
  message: string,
): Promise<boolean> {
  try {
    if (!(await isEnabled())) return false
    await chrome.notifications.create({
      type: 'basic',
      iconUrl: chrome.runtime.getURL('icons/128.png'),
      title,
      message,
    })
    return true
  } catch (error) {
    console.warn('Failed to create notification', error)
    return false
  }
}

export async function notifyTransactionSent(
  amount: string,
  asset: string,
): Promise<boolean> {
  return createNotification('Transaction Sent', `Sending ${amount} ${asset}…`)
}

export async function notifyTransactionConfirmed(
  amount: string,
  asset: string,
): Promise<boolean> {
  return createNotification(
    'Transaction Confirmed',
    `${amount} ${asset} sent successfully`,
  )
}

export async function notifyTransactionFailed(
  amount: string,
  asset: string,
): Promise<boolean> {
  return createNotification(
    'Transaction Failed',
    `${amount} ${asset} transaction failed`,
  )
}
