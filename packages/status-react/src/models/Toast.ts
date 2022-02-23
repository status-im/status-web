export type Toast = {
  id: string
  type: 'confirmation' | 'incoming' | 'approvement' | 'rejection'
  text: string
  request?: string
}
