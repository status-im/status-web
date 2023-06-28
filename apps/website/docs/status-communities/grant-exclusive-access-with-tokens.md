---
id: 592
revision: '0'
language: en
title: Grant exclusive access with tokens
---

As a community owner in Status, you can use tokens to create different access levels within your community. These levels apply to both the community overall and individual channels within it. This approach helps to keep your community engaging and organized.

For example, you can use tokens to organize a conference with community access limited to token holders and exclusive channels just for speakers. If you are an artist or content creator, you can set up a community for your fans and give certain fans access to exclusive channels where you release new content.

The options are many, allowing you to create an environment tailored to your community's needs. For more examples of using tokens to provide exclusive access to your community, check out [Token-based access to communities and channels][token-based-access-to-communities-and-channels].

## Practical example: use a Status Community to organize an event

If you use a Status Community to organize a conference or event, you might want a community open to all interested individuals. Yet, you also need a space just for the speakers.

With tokens, you can limit access to your community only to the individuals invested in the conference topic. Additionally, you can create an exclusive channel within the community, only accessible to the event speakers. This provides a platform for them to discuss and collaborate on the conference preparation.

### Step 1: mint the community tokens

You start minting the community tokens you need to organize the event. In this particular example, you consider two different tokens:

- A general-access token for attendees.
- A VIP-access token only for speakers.

:::info
Currently, you can only mint collectibles.
:::

- [x] [Mint a new collectible][mint-tokens-for-your-community] to grant general access to the event attendees.
- [x] Customize the general-access [collectible options][set-up-collectible-options]. For example, you may want to turn on `Unlimited supply` and turn off the `Not transferable (Soulbound)` option.
- [x] [Mint a collectible][mint-tokens-for-your-community] to grant exclusive access to the event speakers.
- [x] Configure the VIP-access [collectible options][set-up-collectible-options]. In this case, you may want to turn off `Ulimited supply` and turn on the `Not transferable (Soulbound)` and `Remote self-destruct` options.

:::info
You can't change the collectible description or options after minting.
:::

### Step 2: create the token-based permissions

To create the permissions, check out [Set up your community permissions][set-up-your-community-permissions]. In this example, you create two different permissions using the tokens from the [previous step](#step-1-mint-the-community-tokens):

- Community-level permission to grant general access to the conference attendees.
- Channel-level permission to grant exclusive channel access to the event speakers.

You may want to configure these permissions as follows:

| Scope           | Applies to             | Variable        | Option                               |
| :-------------- | :--------------------- | :-------------- | :----------------------------------- |
| Community-level | Attendees and speakers | `Who holds`     | Your general-access token            |
|                 |                        | `Is allowed to` | :desktop-member: Become member       |
|                 |                        | `In`            | Your community                       |
| Channel-level   | Speakers only          | `Who holds`     | Your VIP-access token                |
|                 |                        | `Is allowed to` | :desktop-member: Become member       |
|                 |                        | `In`            | Your exclusive speakers-only channel |

:::tip
You can also set up exclusive access to communities or channels for holders of a particular ENS domain (for example, alice.acme.eth or bob.acme.eth).
:::

### Step 3: distribute tokens to attendees and speakers

After you [create the permissions](#step-2-create-the-token-based-permissions), you can distribute the tokens via [airdrops][how-to-airdrop-tokens-in-status] to all the conference's participants:

- [x] Airdrop the general-access token to the conference attendees and speakers.
- [x] Airdrop the VIP-access token to the conference speakers only.
