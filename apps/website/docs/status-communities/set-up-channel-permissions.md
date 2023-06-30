---
id: 314
revision: '0'
language: en
title: Set up channel permissions
---

:::info
Currently, you can only set up channel permissions using Status desktop.
:::

Community owners can set up permissions using three different variables: `Who holds`, `Is allowed to` and `In`. For each one of them, follow the same procedure and use the table below as a reference.

## What to expect

- Using channel permissions, community owners can restrict channel access and actions to specific people based on token requirements.
- Only the community owner can set up channel permissions.
- Use [community permissions](./set-up-a-private-community.md) to make the entire community private. You can combine community-level and channel-level permission in the same community.
- When you delete a private channel, the channel permissions are lost. If you recreate the channel, you need to set up its permission again.

## Set up channel permission

=== "Desktop"

1. If you're not in the **New permissions** screen, click **Community > Settings > Permissions**.
1. Click **Add permission**.
1. For the `Who holds`, `Is allowed to` and `In` variables, click :desktop-plus: **Add** next to the variable and choose your values. Use the table below for reference.
1. Optionally, check :desktop-hide: **Hide permission** to hide this permission from members who don't meet the requirements.
1. Click **Create permission**.

| Variable        | Description                                                                                               | Options                                |
| :-------------- | :-------------------------------------------------------------------------------------------------------- | :------------------------------------- |
| `Who holds`     | The tokens and amounts (for assets and collectibles) someone needs to hold, or the ENS name someone owns. | Assets, Collectibles, ENS              |
| `Is allowed to` | The level of access or role that you assign to someone.                                                   | Become admin, Become member, Moderate. |
| `In`            | The channel this permission applies to.                                                                   | Channel                                |
