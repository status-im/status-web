export function addCommas(votes: number) {
  return votes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
