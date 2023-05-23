/**
 * Util function that formats a segment for the breadcrumbs
 * @param segment - string to be formatted
 * formatSegment @returns a formatted string with the first letter of each word capitalized and spaces instead of "-"
 **/
const formatSegment = (segment: string): string => {
  // Replaces "-" with a space and capitalize the first letter of each word
  const words = segment.split('-')
  const formattedSegment = words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  return formattedSegment
}

export { formatSegment }
