/**
 * GitHub serves `https://github.com/<user>.png` at full resolution — around
 * 45KB per avatar — no matter how small it is rendered. Asking for an explicit
 * size brings that down to a couple of KB, which matters on article pages where
 * several author avatars load eagerly and compete with the largest paint.
 */
export const getGithubAvatarUrl = (
  username: string,
  renderedSize: number
): string => {
  const url = new URL(`https://github.com/${username}.png`)
  // Request 2x so the avatar stays sharp on high-density screens.
  url.searchParams.set('size', String(renderedSize * 2))

  return url.toString()
}
