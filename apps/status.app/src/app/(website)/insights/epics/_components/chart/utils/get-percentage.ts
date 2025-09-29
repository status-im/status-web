/**
 * An util function that gets the percentage of a value from a total
 * @param value - the value to calculate the percentage
 * @param total - the total value
 **/

export const getPercentage = (value: number, total: number): number =>
  Math.round((value / total) * 100)
