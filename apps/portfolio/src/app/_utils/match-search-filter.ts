export const matchesSearchFilter = (word: string, searchFilter: string) => {
  return word.toLowerCase().includes(searchFilter.toLowerCase())
}
