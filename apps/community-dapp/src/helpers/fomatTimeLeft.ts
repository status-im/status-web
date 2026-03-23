import timeConvert from 'humanize-duration'

export function formatTimeLeft(timeLeft: number) {
  return timeLeft > 0 ? timeConvert(timeLeft * 1000, { largest: 1, round: true }) + ' left' : 'Vote ended'
}

export function formatTimeLeftVerification(timeLeft: number) {
  return timeLeft > 0 ? timeConvert(timeLeft * 1000, { largest: 1, round: true }) + ' left' : 'Verification ended'
}
