export async function fetchQueryFromHasura(query: string) {
  const response = await fetch('https://hasura.infra.status.im/v1/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to fetch data from Hasura.')
  }

  return response.json()
}
