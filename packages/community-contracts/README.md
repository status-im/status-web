# status-community-dapp/contracts

Community directory curator contracts

# Deployments

| **Contract**           | **Address**                                                                                                                                | **Snapshot**                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| **Optimism Goerli**    |                                                                                                                                            |                                                                                                          |
| Directory              | [`0xB3Ef5B0825D5f665bE14394eea41E684CE96A4c5`](https://goerli-optimism.etherscan.io/address/0xB3Ef5B0825D5f665bE14394eea41E684CE96A4c5)    | [`a3967fc`](https://github.com/status-im/community-dapp/commit/a3967fcdf92ddc0c4d814e3fd19fc3bb6b32d2ee) |
| VotingContract         | [`0x744Fd6e98dad09Fb8CCF530B5aBd32B56D64943b`](https://goerli-optimism.etherscan.io/address/0x744Fd6e98dad09Fb8CCF530B5aBd32B56D64943b)    | [`a3967fc`](https://github.com/status-im/community-dapp/commit/a3967fcdf92ddc0c4d814e3fd19fc3bb6b32d2ee) |
| FeaturedVotingContract | [`0x898331B756EE1f29302DeF227a4471e960c50612`](https://goerli-optimism.etherscan.io/address/0x898331B756EE1f29302DeF227a4471e960c50612)    | [`a3967fc`](https://github.com/status-im/community-dapp/commit/a3967fcdf92ddc0c4d814e3fd19fc3bb6b32d2ee) |
| **Optimism Sepolia**   |                                                                                                                                            |                                                                                                          |
| Directory              | [`0x6B94e21FAB8Af38E8d89dd4A0480C04e9a5c53Ab`](https://optimism-sepolia.blockscout.com/address/0x6B94e21FAB8Af38E8d89dd4A0480C04e9a5c53Ab) | [`baaa3d0`](https://github.com/status-im/community-dapp/commit/baaa3d0e12308a1f65e365237ad6eb0426e105a6) |
| VotingContract         | [`0x7Ff554af5b6624db2135E4364F416d1D397f43e6`](https://optimism-sepolia.blockscout.com/address/0x7Ff554af5b6624db2135E4364F416d1D397f43e6) | [`baaa3d0`](https://github.com/status-im/community-dapp/commit/baaa3d0e12308a1f65e365237ad6eb0426e105a6) |
| FeaturedVotingContract | [`0x336DFD512164Fe8CFA809BdE94B13E76e42edD6B`](https://optimism-sepolia.blockscout.com/address/0x336DFD512164Fe8CFA809BdE94B13E76e42edD6B) | [`baaa3d0`](https://github.com/status-im/community-dapp/commit/baaa3d0e12308a1f65e365237ad6eb0426e105a6) |
| **Optimism Mainnet**   |                                                                                                                                            |                                                                                                          |
| Directory              | [`0xA8d270048a086F5807A8dc0a9ae0e96280C41e3A`](https://optimistic.etherscan.io/address/0xA8d270048a086F5807A8dc0a9ae0e96280C41e3A)         | [`af44986`](https://github.com/status-im/community-dapp/commit/af449861d7cd259e238136bab7efb09f148fb8bd) |
| VotingContract         | [`0x321Ba646d994200257Ce4bfe18F66C9283ad1407`](https://optimistic.etherscan.io/address/0x321Ba646d994200257Ce4bfe18F66C9283ad1407)         | [`af44986`](https://github.com/status-im/community-dapp/commit/af449861d7cd259e238136bab7efb09f148fb8bd) |
| FeaturedVotingContract | [`0x2EA9700E7F27E09F254f2DaEc5E05015b2b961d0`](https://optimistic.etherscan.io/address/0x2EA9700E7F27E09F254f2DaEc5E05015b2b961d0)         | [`af44986`](https://github.com/status-im/community-dapp/commit/af449861d7cd259e238136bab7efb09f148fb8bd) |

## Mock Contract

Mock Contract is a mock of voting smart contract for community curation.

This Contract is responsible for creating voting rooms in which you can vote for addition or deletion of community into directory.
Directory of communities will be held on another smart contract at finalization this contract will call smart contract with directory, to make necessary changes.
When voting room is initialized for given community another can't be started for the same community until previous one was finalized.

Lifecycle of voting room: 1. initialize voting room. 2. period of time when votes are accepted. 3. voting time is finished votes are no longer accepted and voting room can be finalized. 4. finalization

### Voting room initialization

```solidity
function initializeVotingRoom(uint8 voteType, address publicKey) public
```

When initializing a voting user needs to supply a type of vote (0: removal, 1: addition) and publicKey of community.
Voting room can't be created if given community is undergoing vote.
If voting room has been created message is emitted.

after voting room creation event is emitted

```solidity
event VotingRoomStarted(uint256 roomId)
```

TODO:
-vote type chosen automatically based if community is in directory

### Voting room structure

```solidity
    enum VoteType { REMOVE, ADD }

    struct VotingRoom {
        uint256 startBlock; // block at which vote was initialized
        uint256 endAt; // timestamp of when the voting room will close
        VoteType voteType; // type of voting room (1: removal, 2: addition)
        bool finalized; // was voting room finalized ( community added/delted from directory )
        address community; // publicKey of community
        uint256 totalVotesFor; // sum of snt votes for vote
        uint256 totalVotesAgainst; // sum of snt votes against
        mapping(address => bool) voted; // list of voters that voted
    }
```

### Finalizing voting room

Once time of voting has passed community needs to be added or removed from directory according to vote result.
For that smart contract has vote finalization function.

```solidity
function finalizeVotingRoom(uint128 voteID) public
```

after finalization event is emitted

```solidity
event VotingRoomFinalized(uint256 roomId);
```

### Voting

Everyone can send a list of aggregated and signed votes

```solidity
    struct SignedVote {
        address voter; // address of voter
        uint256 roomIdAndType; // first bit is type of vote (0: against, 1: for) rest of bits are room Id.
        uint256 sntAmount; // amount of snt to vote
        bytes32 r; // r parameter of signature
        bytes32 vs; // vs parameter of signature [see](https://eips.ethereum.org/EIPS/eip-2098)
    }

    function castVotes(SignedVote[] calldata votes) public
```
