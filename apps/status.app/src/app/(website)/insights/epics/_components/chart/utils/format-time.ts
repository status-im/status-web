import { timeFormat } from 'd3-time-format'

/**
 * Util functions that formats a date
 * formatDate @returns a string with the format 'MMM dd yyyy' - Ex: Jan 01 2021
 **/
export const formatDate = timeFormat('%b %d %Y')

/**
 * Util functions that formats a date
 * format @returns a string with the format 'dd MMM' - Ex: 01 Jan
 **/
export const format = timeFormat('%d %b')
