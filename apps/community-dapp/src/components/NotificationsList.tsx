import { useNotifications } from '@usedapp/core'
import React from 'react'
import styled from 'styled-components'
import { AnimationNotification, AnimationNotificationMobile } from '../constants/animation'
import { useContracts } from '../hooks/useContracts'
import { NotificationItem, NotificationInfoItem, NotificationErrorItem } from './NotificationItem'
import { useWaku } from '../providers/waku/provider'

export function NotificationsList() {
  const { notifications } = useNotifications()
  const { votingContract } = useContracts()
  const { isLoading, isError, restart } = useWaku()

  return (
    <NotificationsWrapper>
      {isLoading && <NotificationInfoItem text="Connecting to a Waku node." />}

      {!isLoading && isError && <NotificationErrorItem text="Failed connect to a Waku node." action={restart} />}

      {notifications.map((notification) => {
        if ('receipt' in notification) {
          return notification.receipt.logs.map((log) => {
            if (log.address !== votingContract.address) {
              return
            }

            // this needs to be updated so it takes into account also interface of featuredVotingContract
            const parsedLog = votingContract.interface.parseLog(log)

            let text
            if (parsedLog.name === 'VotingRoomStarted') {
              text = ' voting room started.'
            }
            if (parsedLog.name === 'VotingRoomFinalized') {
              if (parsedLog.args.passed == true) {
                if (parsedLog.args.voteType === 1) {
                  text = ' is now in the communities directory!'
                }

                if (parsedLog.args.voteType === 0) {
                  text = ' is now removed from communities directory!'
                }
              }
            }
            if (text) {
              return (
                <NotificationItem
                  key={log.transactionHash}
                  publicKey={parsedLog.args.publicKey}
                  text={text}
                  transaction={notification.transaction}
                />
              )
            }
          })
        }
      })}
    </NotificationsWrapper>
  )
}

const NotificationsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  position: fixed;
  top: 191px;
  right: 16px;
  flex-direction: column;
  transition: all 0.3s;
  animation: ${AnimationNotification} 2s ease;
  z-index: 100;

  @media (max-width: 600px) {
    top: unset;
    right: unset;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    animation: ${AnimationNotificationMobile} 2s ease;
  }
`
