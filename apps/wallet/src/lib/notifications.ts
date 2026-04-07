import { storage } from '@wxt-dev/storage'

const ENABLED_KEY = 'local:notifications:enabled' as const

async function isEnabled(): Promise<boolean> {
  return (await storage.getItem<boolean>(ENABLED_KEY)) ?? true
}

export async function notifyTransactionSent(
  amount: string,
  asset: string,
): Promise<void> {
  if (!(await isEnabled())) return
  await chrome.notifications.create({
    type: 'basic',
    iconUrl: chrome.runtime.getURL('icons/128.png'),
    title: 'Transaction Sent',
    message: `Sending ${amount} ${asset}…`,
  })
}

export async function notifyTransactionConfirmed(
  amount: string,
  asset: string,
): Promise<void> {
  if (!(await isEnabled())) return
  await chrome.notifications.create({
    type: 'basic',
    iconUrl: chrome.runtime.getURL('icons/128.png'),
    title: 'Transaction Confirmed',
    message: `${amount} ${asset} sent successfully`,
  })
}

export async function notifyTransactionFailed(
  amount: string,
  asset: string,
): Promise<void> {
  if (!(await isEnabled())) return
  await chrome.notifications.create({
    type: 'basic',
    iconUrl: chrome.runtime.getURL('icons/128.png'),
    title: 'Transaction Failed',
    message: `${amount} ${asset} transaction failed`,
  })
}
