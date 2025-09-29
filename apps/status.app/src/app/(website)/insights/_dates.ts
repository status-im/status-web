import { format } from 'date-fns'

export const INITIAL_DATES = {
  from: '2018-05-01',
  to: format(new Date(), 'yyyy-MM-dd'),
}
