import { keyframes } from 'styled-components'

export function Animation() {
  return keyframes`
    0% { transform: translateX(-50%) scaleX(0); }
    100% { transform: translateX(-50%) scaleX(100%); }
`
}

export function AnimationNotification() {
  return keyframes`
    0% { 
      opacity: 0;
      transform: translateX(-100%); }
    100% { 
      opacity: 1;
      transform: translateX(0); }
`
}

export function AnimationNotificationMobile() {
  return keyframes`
    0% { 
      opacity: 0;
      transform: translateY(100%); }
    100% { 
      opacity: 1;
      transform: translate(-50%, 0%); }
`
}
