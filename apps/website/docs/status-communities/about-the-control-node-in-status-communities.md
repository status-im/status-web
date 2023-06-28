---
id: 506
revision: '0'
language: en
title: About the control node in Status Communities
---

:::info
Currently, you can only administer communities and run a control node using the Status desktop app. [:octicons-desktop-download-16: Download Status desktop][status-web-download].
:::

Status Communities require a type of node called the control node for administration purposes. When you [create a community][create-a-status-community], your computer becomes a control node.

As the community owner, the control node runs automatically in your Status desktop app if you use the same profile and computer where you set up the community.

## The basics

- The computer where you [create your Status Community][create-a-status-community] and every computer where you run Status desktop and [restore your community's private key][restore-your-status-community] becomes a control node.
- To provide the best experience for your members, keep the Status desktop app acting as the control node online every day or at least once every six days.
- Don't use more than one installation of Status Desktop as your community's control node. Running your community with multiple control nodes will cause unforeseen issues and increase your community's bandwidth requirements.
- You can [install a new control node][replace-your-community-s-control-node] when you need to reinstall Status desktop or it becomes unavailable.
- Owners can [set up additional computers](#administer-your-community-from-a-different-computer) to administer their community or [delegate admin permissions to someone else][delegate-admin-functions-to-community-members]. Owners still need the Status desktop app acting as the control node running and connected to the internet.

## Maintain your community available

The community control node maintains the settings, configuration and functionality of your community. Keep the Status desktop app where you set up your community running and connected to the internet as much as possible, or at least once every six days.

If the control node goes offline, your [community's functionality is affected][common-issues-when-the-community-s-control-node-is-offline]. You can [set up a new control node][replace-your-community-s-control-node] if the initial Status desktop fails or becomes inaccessible.

:::warn
Don't use more than one installation of Status desktop as your community's control node. Running your community with multiple control nodes will cause unforeseen issues and increase your community's bandwidth requirements.
:::

## Administer your community from a different computer

If you want to administer your community from another computer, [set up your same Status profile on that computer][create-or-restore-profile-with-recovery-phrase] without importing the community's private key. This process doesn't create a new control node, and you can complete it on as many computers as you want.

Using a different computer is helpful if you run your Status Community on your desktop computer but want to travel with your laptop, for example. Additionally, you can [delegate admin permissions to others][delegate-admin-functions-to-community-members] using tokens.

:::tip
Community control nodes are the only ones with access to the community's private key. If you run Status desktop on multiple computers and are unsure which one is the control node, verify if you can [back up your community's private key][back-up-your-community-s-private-key]. If you can, you're running a control node.
:::

No matter how many additional computers you use to administer your community, they all forward admin tasks to the Status desktop app working as the control node, which functions as the administration hub.

:::info
Your community is still available when the Status desktop app acting as the control node is offline, but your community members' experience degrades. For more information, check out [Common issues when the control node is offline][common-issues-when-the-community-s-control-node-is-offline].
:::
