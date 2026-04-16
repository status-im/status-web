---
title: Karma tokenomics
subtitle: Reputation, gasless transactions, and governance on Status Network
---

Status Network is the first reputation-based Layer 2, where execution is gasless, spam protection is cryptographic, and network funding comes from productive capital and real network activity rather than transaction fees.

At the center of this model is Karma: a soulbound ERC-20 token that determines each user’s free transaction throughput, their governance power over the native yield pool, and their reputation in the network. Karma cannot be bought, sold, or transferred. It is only earned through contribution.

This post details how Karma is created, distributed, and enforced, from genesis through long-term operation.

## Genesis supply

Status Network launches with an initial Karma supply of **1,000,000,000 (1B) Karma**.

This genesis allocation is distributed entirely to participants who committed capital and infrastructure ahead of mainnet through the pre-deposit phase:

| Recipient                          | Share | Karma       |
| :--------------------------------- | :---- | :---------- |
| **SNT stakers**                    | 25%   | 250,000,000 |
| **ETH depositors**                 | 20%   | 200,000,000 |
| **GUSD depositors**                | 20%   | 200,000,000 |
| **LINEA depositors**               | 10%   | 100,000,000 |
| **Native apps & users onboarding** | 25%   | 250,000,000 |

Within each vault, allocation is pro-rata based on deposit size and time in the vault, with a linear daily distribution over each vault’s lifetime. Whales who pre-deposited get the highest level.

The native apps allocation (250M Karma) goes directly to the launch applications building on Status Network: Orvex (DEX), FIRM (CDP stablecoin), punk.fun (token launchpad), Bermuda (privacy layer), and other confirmed launch partners. Apps receive their Karma allocation outright and decide how to deploy it. They can use it for governance participation, redistribute it to their users, or allocate it to incentivize specific behaviors within their protocols.

Keeping apps autonomous preserves their governance voice and their ability to attract users on their own terms. Accountability comes through the governance mechanism itself: if an app hoards Karma without contributing value, Karma holders can vote to reduce its share of the native yield allocation, and over time they will get diluted by the Karma emissions.

## Emission schedule

After genesis, new Karma is minted each epoch according to a halving emission schedule.

Year 1 target inflation is **100% of genesis supply**, meaning approximately 1B additional Karma is minted during the first 12 months of mainnet operation. This makes the genesis allocation equal to 50% of the cumulative supply at the end of year one.

Target emissions then decrease annually until reaching a 200M floor:

| Year            | Annual target emission | Cumulative supply | Inflation rate |
| :-------------- | :--------------------- | :---------------- | :------------- |
| **0 (genesis)** | —                      | 1,000,000,000     | —              |
| **1**           | 1,000,000,000          | 2,000,000,000     | 100%           |
| **2**           | 500,000,000            | 2,500,000,000     | 25%            |
| **3**           | 300,000,000            | 2,800,000,000     | 12%            |
| **4**           | 200,000,000 (floor)    | 3,000,000,000     | 7.1%           |
| **5**           | 200,000,000            | 3,200,000,000     | 6.3%           |
| **10**          | 200,000,000            | 4,200,000,000     | 4.8%           |
| **20**          | 200,000,000            | 6,200,000,000     | 3.2%           |

Unlike Bitcoin's halving schedule (which converges to zero issuance), Karma maintains a permanent emission floor. This is a deliberate design choice: a network that onboards millions of new users and agents per year cannot afford to have its reputation supply freeze. The floor ensures the network remains permanently open to new participants while inflation converges toward low single digits as a percentage of total supply.

These are target rates. In the initial phase, the protocol retains the ability to adjust emission pace and floor level based on network traction, funding pool volume, and onchain activity levels. The long-term goal is to ossify the emission mechanism entirely, tying inflation to observable onchain metrics rather than discretionary governance decisions, so that Karma issuance becomes as predictable and credibly neutral as block rewards.

## Epoch-based minting

Karma is minted in bi-weekly epochs rather than continuously. Each epoch, the protocol distributes Karma allocation across three buckets:

| Karma bucket                        | Share | Purpose                                                                       |
| :---------------------------------- | :---- | :---------------------------------------------------------------------------- |
| **SNT staking**                     | 35%   | Reward long-term liquid token holders who anchor network security through RLN |
| **Liquidity provision & app usage** | 60%   | Reward LPs, active users, and builders who generate onchain activity          |
| **Sequencer tips & donations**      | 5%    | Reward voluntary contributions to network operations and the funding pool     |

In year one, this translates to a rough average of 19,230,000 Karma minted per week: ~6,730,000 to SNT stakers, ~11,540,000 to liquidity and apps, and ~960,000 to tips and donations.

The 35% allocation to SNT staking is intentionally high at launch. The network needs a strong initial base of staked SNT to power the RLN-based spam protection mechanism. As TVL grows and onchain activity deepens, governance can vote to rebalance this ratio, shifting more emission toward liquidity provision and app usage where marginal Karma has higher impact on network growth.

All ongoing Karma mints, including captcha-based registrations for new users (detailed below), draw from these epoch emissions.

## Actual and virtual Karma

The Karma system employs a two-tier balance architecture: **actual Karma** and **virtual Karma**.

Actual Karma tokens are non-transferable ERC-20 tokens that exist onchain. They carry governance voting power through ERC20Votes delegation and checkpoints, and they count toward throughput tier calculations.

Virtual Karma represents reward balances tracked by external reward distributor contracts. These rewards accrue continuously based on each distributor's logic (staking duration, liquidity provision, application usage) and are fully backed 1:1 by actual Karma tokens held by the distributor contract. Virtual rewards are not transferred until explicitly redeemed by the user.

A user's total Karma balance is the sum of their actual tokens plus all virtual rewards across registered distributors. This design enables real-time reward accrual without requiring a token transfer for every accrual event.

Multiple reward distributors operate simultaneously at launch:

The **StakeManager** distributes Karma based on staked SNT positions held in per-user StakeVault contracts. It implements multiplier points that reward longer staking duration: the longer an account stakes, the higher its share of Karma rewards. This means two SNT stakers with identical deposit sizes will earn different amounts of Karma if one has staked for longer.

**SimpleKarmaDistributor** instances enable offchain services to distribute Karma based on externally verified conditions such as proof of humanity, community contributions, and campaign rewards.

**KarmaAirdrop** contracts use Merkle tree proofs for gas-efficient batch distribution with epoch-based claim tracking.

Only redeemed (actual) Karma carries governance voting power. Virtual Karma accrues in the background and must be claimed before it can be used for onchain governance votes.

## Gasless throughput tiers

The total Karma balance determines how many free transactions an address can submit per day. The initial RLN rate-limiting epoch is set to 24 hours, but in future upgrades the epoch length will vary based on tiers (higher tiers will have shorter epochs). The relationship between Karma balance and throughput is structured in 10 tiers:

| ID     | Tier            | Karma range | Free transactions / day |
| :----- | :-------------- | :---------- | :---------------------- |
| **0**  | None            | \< 1        | 0                       |
| **1**  | Entry           | 1           | 2                       |
| **2**  | Newbie          | 1–50        | 6                       |
| **3**  | Basic           | 50–500      | 16                      |
| **4**  | Active          | 500–5K      | 96                      |
| **5**  | Regular         | 5K–20K      | 480                     |
| **6**  | Power           | 20K–100K    | 960                     |
| **7**  | Pro             | 100K–1M     | 10,080                  |
| **8**  | High-Throughput | 1M–5M       | 108,000                 |
| **9**  | S-Tier          | 5M–10M      | 240,000                 |
| **10** | Legendary       | 10M+        | 480,000                 |

Higher tiers are designed for protocol infrastructure, core applications, high-frequency bot operators, and institutional participants.

The Entry tier requires just **1 Karma**, obtainable by completing a one-time captcha verification. This ensures anyone can start using the network immediately with a minimal free transaction quota: 2 transactions per day, enough to get to the next Karma tier by exploring apps or completing basic interactions.

Each captcha mint creates 1 Karma drawn from the current epoch's emission bucket. Even at ten million account registrations, captcha mints consume only 10M Karma, under 1% of year-one emissions. The mechanism scales without distorting the broader emission schedule.

Tier thresholds are governance-adjustable. If spam patterns shift or network capacity changes, thresholds can be raised (requiring more Karma per tier). For example, raising the Entry tier from 1 to 3 Karma would tighten access without penalizing existing participants who already hold more.

Users who exhaust their gasless quota within an epoch can still transact by paying a premium gas fee (a "sequencing tip" initially set at 100 gwei). This provides a pressure valve for burst demand while ensuring the base-case execution remains free.

Throughput limits are enforced by the Rate Limiting Nullifier (RLN), a zero-knowledge primitive that verifies transaction rate compliance without revealing the sender's identity or normal activity. Only quota violations are surfaced, compliant usage remains private.

## How to earn Karma

Karma is earned exclusively through contribution to the network. There is no market, no OTC desk, no liquidity pool for Karma.

**Stake SNT.** Staking SNT into the Status Network staking contract is the most capital efficient way to earn Karma. Users earn Karma proportional to their SNT stake, drawn from the 35% SNT staking bucket. The StakeManager's multiplier point system means longer staking durations earn progressively higher shares of the Karma distribution. This is the most direct path to Karma for existing SNT holders and the primary mechanism securing the RLN spam protection layer.

**Provide liquidity.** Depositing into native DEX pairs on Orvex, minting USF on FIRM, or providing liquidity to core apps earns Karma from the 60% liquidity and apps bucket. Karma earned scales with the value and duration of liquidity provided.

**Complete captcha and zkID verifications.** A one-time captcha grants 1 Karma, unlocking Entry tier access (2 free transactions per day). This is the entry point for new users who have no tokens and no prior relationship with the network. They can also add a private ID verification or proof of activity on other networks to earn additional Karma. This comes from the same 60% bucket.

**Use and build apps.** Active users of native applications also earn Karma through this 60% bucket. Developers deploying contracts and generating onchain activity are also eligible. The specific distribution within this bucket is initially determined by rough ecosystem consensus based on needs (liquidity, activity, developers, etc.), and will be progressively handled by community governance.

**Tip the network.** Paying sequencer tips or making voluntary donations to the native funding pool earns Karma from the 5% tipping bucket.

![Flowchart showing how Karma is earned, reputation unlocks gasless transactions, and yield funds L2 operations on Status Network.](/karma-tokenomics/flowchart.png)

## Actual governance power

Karma is the sole governance token of Status Network. Karma holders vote on the allocation of the native yield pool, which accumulates revenue from two sources: bridged yield (ETH staking via Lido stVaults, GUSD lending via Morpho and Sky savings) and fees from native applications (Orvex, FIRM, punk.fun, Bermuda, sequencing tips, and more to be announced).

Governance power is proportional to redeemed (actual) Karma balance. Because Karma is soulbound and non-transferable, governance influence must be earned through sustained participation rather than purchased on secondary markets.

Key governance decisions include:

**Yield allocation.** How the native funding pool is distributed across liquidity incentives, app builder grants, and operational costs.

**Karma emission rebalancing.** Adjusting the ratio between SNT staking, liquidity/apps, and operations buckets as network maturity changes.

**Tier thresholds.** Modifying the Karma requirements and transaction quotas for each gasless throughput tier.

**App inclusion.** Voting on which applications receive native app status, Karma allocation, and access to the funding pool.

**Network parameters.** RLN configuration, epoch duration, and other protocol-level settings.

**Karma slashing.** Any account in the Active tier and above (550+ Karma) can slash accounts that spam the network (see below).

## Slashing and spam enforcement

Gasless execution on Status Network is protected by a two-layer enforcement system.

**Layer 1: Tier-based rate limiting.** Each user's Karma balance maps to a throughput tier with a defined transaction quota per day. When a user exceeds their tier quota, the prover places them on a temporary deny list. Gasless access is suspended until the deny list entry expires after a predefined reset interval. The user can still transact by paying premium gas fees. No Karma is lost. This layer handles normal congestion and accidental over-usage.

**Layer 2: RLN-based cryptographic enforcement.** The protocol defines a global rate limit parameter, which sets the absolute maximum number of transactions any account can attempt per day regardless of tier. If a user exceeds that global rate, the RLN construction exposes their secret through Shamir's Secret Sharing: two proofs using the same nullifier within the same epoch are sufficient for any observer to recover the underlying secret key.

This is where slashing occurs. Any account with more than 500 Karma can serve as slasher nodes. They monitor published blocks for duplicate nullifiers. When a violation is detected, the slasher recovers the secret and submits it to the RLN contract through a two-step commit-reveal scheme (preventing front-running of slash transactions).

Slash execution proceeds as follows:

1. All virtual Karma rewards from registered reward distributors are forcibly redeemed, converting them to actual tokens so they can be burned.

2. **100% of the violator's total Karma balance is slashed.**

3. Of the slashed amount, **50% is minted as a reward to the slasher** who detected and submitted the violation.

4. The remaining **50% is burned**, creating permanent deflationary pressure.

5. The violator's id-commitment is removed from the RLN membership Merkle tree, preventing further gasless transaction submission until they reacquire sufficient Karma and re-register.

No Karma is "staked" in the RLN contract. Karma is non-transferable by design, so the slashing penalty is enforced through the Karma contract itself. Registration in RLN requires only that a user's Karma balance meets the minimum threshold (1 Karma). The prover handles registration automatically, users interact with standard wallets and never touch RLN proofs directly.

Because Karma is earned through time and contribution, slashing carries meaningful opportunity cost. An attacker cannot buy back their slashed balance. They must re-earn it through legitimate participation: staking, providing liquidity, using apps. This creates a sustained deterrent against abuse proportional to the attacker's ambition. The higher the tier an attacker wants to exploit, the more time and genuine contribution they must invest to reach it, and the more they lose when caught.

The 100% slash (rather than partial) is justified by the two-layer design. By the time a user triggers cryptographic slashing, they have already exceeded both their tier quota (first layer) and the global rate limit (second layer). Two distinct thresholds must be violated. Accidental over-usage is caught by the soft layer with no penalty. If you're being slashed, the protocol has strong evidence of deliberate abuse.

Beyond per-account enforcement, the network includes a circuit breaker for coordinated attacks. If aggregate network load exceeds safe thresholds (for example, from a large-scale Sybil attack using millions of low-tier accounts acting within their individual quotas), the protocol can activate premium gas for all transactions network-wide. This inverts the attacker's economics: every one of their Sybil accounts must now pay 100 gwei gas per transaction, making the attack financially ruinous at scale. Legitimate users caught in the circuit breaker are compensated with Karma after the event (they paid a sequencing tip so receive Karma proportionally from the 5% bucket), potentially increasing their tier and throughput post-recovery. The attack literally makes real users more powerful while destroying the attacker's capital.

## Supply dynamics

Karma supply is shaped by three forces:

**Emission (inflationary).** Epoch-based minting adds new Karma according to the emission reduction schedule. This is the dominant force in early years, stabilizing at 200M Karma per year from year 4 onward.

**Burning (deflationary).** RLN slashing burns 50% of every slashed balance. The deflationary effect scales with attack frequency: a network under sustained attack burns more Karma, tightening supply.

**Soulbound constraint (velocity zero).** Because Karma cannot be transferred, there is no secondary market, no velocity, and no speculative pressure. Every unit of Karma in circulation was earned by its current holder. This makes the supply schedule predictable and eliminates the governance attack vectors that plague transferable governance tokens: flash loan attacks, vote buying, and governance token accumulation by hostile actors.

Over the long run, the combination of floor-rate emissions and slashing-based burning produces a supply that grows linearly but at a decreasing percentage rate. The exact growth trajectory depends on network activity and spam levels, two variables that are inherently unpredictable but structurally constrained.

## Sanity checks

**Can a pre-depositor actually reach a meaningful tier?**

At genesis, 750M Karma goes to depositors across four vaults. With approximately 1,400 pre-depositors at the time of writing, average allocation is ~535,000 Karma per depositor, placing the average early participant at tier 8 (High-Throughput: 500K–5M Karma, 108,000 tx/day). Large depositors comfortably reach S-Tier or Legendary status. Pre-depositors are among the most powerful participants at launch, which is the intended reward for committing capital ahead of mainnet.

**Does the captcha mechanism scale?**

Ten million Entry registrations consume 10M Karma, under 1% of year-one emissions (1B). The mechanism scales comfortably under an initial realistic onboarding scenario. In the longer term, if hundreds of millions of Entry registrations are necessary, Karma requirements for the first tier will be lowered.

**Is year-one emission enough to incentivize growth?**

1B Karma minted across 26 bi-weekly epochs gives ~38.5M Karma per epoch. With the 60% liquidity pool, roughly 23M Karma flows to LPs and users each distribution. If the network reaches $50M TVL with 1,000 active LPs, each LP earns an average of ~11,500 Karma per week, reaching the Regular tier (5K Karma, 480 tx/day) within the first week and the Power tier (20K Karma, 960 tx/day) within two weeks. Active users earning from the same pool reach Basic tier within their first week of regular usage. The ramp is steep enough to reward early participation without gatekeeping newcomers.

**What does governance concentration look like?**

After year one (2B total supply), pre-depositors hold 1B (50%) and year-one earners hold 1B (50%). Within the earner pool, SNT stakers hold 350M, LPs and users hold 600M, and operations contributors hold 50M. No single category dominates, and the soulbound constraint prevents accumulation through acquisition. Governance power is distributed across capital providers, active users, and builders by design.

**Does 100% slashing create governance concentration for slashers?**

Slashers (Active tiers and above) receive 50% of slashed balances. A single slash of a Legendary-tier account (10M+ Karma) could transfer 5M+ Karma to an already-powerful participant. At launch, when violation frequency should be low, this effect is minimal. If slashing becomes frequent, governance can introduce a cap on slasher rewards (e.g., 50% up to a ceiling, remainder burned) to prevent runaway concentration. This is worth monitoring but does not require action at genesis.

**What happens to the emission ratio long-term?**

The 35% SNT staking share is a bootstrap weight. As the network matures, governance is expected to shift this ratio toward the liquidity and apps pool. A plausible year-three rebalance might look like 20% SNT staking / 75% liquidity & apps / 5% operations. The mechanism for this rebalance is a standard Karma governance vote, ensuring the community retains control over how new reputation is distributed.

## Summary

Karma is the primitive that makes gasless execution, spam resistance, and community governance work as a unified system.

| Property               | Design                                                                                                   |
| :--------------------- | :------------------------------------------------------------------------------------------------------- |
| **Token type**         | Soulbound ERC-20 (non-transferable, with ERC20Votes)                                                     |
| **Balance model**      | Actual (onchain, votable) + Virtual (accrued in distributors, redeemable)                                |
| **Genesis supply**     | 1,000,000,000 Karma                                                                                      |
| **Emission schedule**  | Decreasing annually to a floor of 200M Karma/year (reached year 4)                                       |
| **Long-term emission** | 200,000,000 Karma/year (permanent floor)                                                                 |
| **Minting**            | Bi-weekly epochs: 35% SNT / 60% LP & apps / 5% operations                                                |
| **Entry point**        | 1 Karma via captcha (one-time, from epoch emissions)                                                     |
| **Throughput**         | 10 tiers from Entry (2 tx/day) to Legendary (480,000 tx/day)                                             |
| **Epoch length**       | 24 hours                                                                                                 |
| **Governance**         | Proportional to redeemed (actual) balance; controls native yield allocation, tiers, parameters, slashing |
| **Slashing**           | RLN global rate limit violations: 100% of balance; 50% to slasher, 50% burned                            |
| **Tier violations**    | Temporary deny list, no Karma loss, premium gas fallback                                                 |
| **Decay**              | None at launch; tier threshold adjustments available as alternative                                      |

_Reputation: earned._  
_Gasless transactions: unlocked._  
_Yield: governed._

Pre-deposits are live at [**hub.status.network/pre-deposits**](https://hub.status.network/pre-deposits). Earn Karma ahead of mainnet.

Learn more at [**status.network**](https://status.network/). Follow updates at [**@StatusL2**](https://x.com/StatusL2). Join the builders at [**t.me/StatusL2**](https://t.me/StatusL2).
