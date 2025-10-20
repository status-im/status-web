import type { DayType } from '..'

/**
 * Gets the total issues of a day
 * @param d - the day to get the total issues
 * @returns the total issues of a day
 **/
export const getTotalIssues = (d: DayType) => d?.open_issues + d?.closed_issues

/**
 * Gets the closed issues of a day
 * @param d - the day to get the closes issues
 * @returns the total issues of a day
 **/
export const getClosedIssues = (d: DayType) => d?.closed_issues
