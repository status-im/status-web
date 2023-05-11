/**
 * An util function that calculates the percentage of a value from a total
 * @param value - the value to calculate the percentage
 * @param total - the total value
 **/

export const calculatePercentage = (value: number, total: number): number =>
  Math.round((value / total) * 100)
