import { timeFormat } from 'd3-time-format'

/**
 * Util functions that formats a date
 * f @returns a string with the format 'MMM dd, yyyy' - Ex: Jan 01, 2021
 **/
export const formatDate = timeFormat('%b %d, %Y')
