export const dynamic = 'force-static'

const llmsData = {
  title: 'hub.status.network llms.txt',
  sections: [
    {
      title: 'Hub Homepage',
      links: [
        [
          'Status Network Hub – Gasless Ethereum L2',
          'https://hub.status.network',
          'Central hub for Status Network, a gasless Ethereum Layer 2 with a native privacy layer, designed for liquidity onboarding, shared yield, and participation.',
        ],
      ],
    },
    {
      title: 'Pre-Deposits',
      links: [
        [
          'Pre-Deposit Crypto on Status Network',
          'https://hub.status.network/pre-deposits',
          'Pre-deposit crypto assets to help seed network liquidity, earn yield, and prepare for staking and app participation on a gasless Ethereum Layer 2 with privacy by design.',
        ],
      ],
    },
    {
      title: 'App Discovery',
      links: [
        [
          'Discover Apps on Status Network',
          'https://hub.status.network/discover',
          'Explore decentralized applications built on Status Network, a gasless Ethereum Layer 2 where apps can offer private interactions by default.',
        ],
      ],
    },
    {
      title: 'Staking',
      links: [
        [
          'Stake Crypto on Status Network',
          'https://hub.status.network/stake',
          'Stake crypto on Status Network to earn yield while supporting a gasless Ethereum Layer 2 that includes a native privacy layer and focuses on sustainable liquidity.',
        ],
      ],
    },
    {
      title: 'Reputation Governance',
      links: [
        [
          'Karma – Reputation Governance on Status',
          'https://hub.status.network/karma',
          "Karma is Status Network's non-transferable reputation system used for governance, incentives, and access, supporting privacy-preserving participation across the ecosystem.",
        ],
      ],
    },
  ],
}

function renderMarkdown(data: typeof llmsData): string {
  let output = `# ${data.title}\n\n`

  for (const section of data.sections) {
    output += `## ${section.title}\n`
    for (const [text, url, description] of section.links) {
      output += `- [${text}](${url}): ${description}\n`
    }
    output += `\n`
  }

  return output
}

export function GET() {
  const content = renderMarkdown(llmsData)

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
