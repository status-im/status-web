// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import { Test } from "forge-std/Test.sol";
import { MiniMeToken } from "@vacp2p/minime/contracts/MiniMeToken.sol";
import { DeployContracts } from "../script/DeployContracts.s.sol";
import { DeploymentConfig } from "../script/DeploymentConfig.s.sol";
import { SigUtils } from "./SigUtils.sol";
import { Directory } from "../contracts/Directory.sol";
import { VotingContract } from "../contracts/VotingContract.sol";
import { FeaturedVotingContract } from "../contracts/FeaturedVotingContract.sol";

// solhint-disable-next-line max-states-count
contract FeaturedVotingContractTest is Test {
    uint32 internal featuredVotingLengthInSeconds;
    uint32 internal featuredVotingVerificationLengthInSeconds;
    uint256 internal votingWithVerificationLength;

    address internal votingContract;

    address internal bob;
    uint256 internal bobsKey;
    address internal alice;
    uint256 internal alicesKey;

    bytes[] internal communityIDs;

    event VotingStarted();
    event NotEnoughToken(bytes community, address voter);
    event AlreadyVoted(bytes community, address voter);
    event VoteCast(bytes community, address voter);
    event InvalidSignature(bytes community, address voter);
    event CommunityFeaturedRecently(bytes community, address voter);
    event VotingFinalized();

    SigUtils internal sigUtils;

    Directory internal directoryContract;
    FeaturedVotingContract internal featuredVotingContract;
    MiniMeToken internal mockSNT;

    address internal deployer;

    // solhint-disable-next-line var-name-mixedcase
    bytes32 internal DOMAIN_SEPARATOR;
    // solhint-disable-next-line var-name-mixedcase
    bytes32 internal constant EIP712DOMAIN_TYPEHASH =
        keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");

    bytes32 public constant VOTE_TYPEHASH =
        keccak256("Vote(address voter,bytes community,uint256 sntAmount,uint256 timestamp)");

    function _hashDomainData(uint256 chainId, address verifyingContract) internal pure returns (bytes32) {
        return keccak256(
            abi.encode(
                EIP712DOMAIN_TYPEHASH,
                keccak256(bytes("Featured Voting Contract")),
                keccak256(bytes("1")),
                chainId,
                verifyingContract
            )
        );
    }

    function _createSignedVote(
        uint256 signer,
        address voter,
        bytes memory community,
        uint256 amount,
        uint256 timestamp
    )
        internal
        view
        returns (FeaturedVotingContract.SignedVote memory)
    {
        bytes32 voteHash = sigUtils.getTypedDataHash(
            SigUtils.FeaturedVote({ voter: voter, community: community, sntAmount: amount }), timestamp
        );
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(signer, voteHash);

        return FeaturedVotingContract.SignedVote({
            voter: voter,
            community: community,
            sntAmount: amount,
            timestamp: timestamp,
            r: r,
            vs: (bytes32(uint256(v > 27 ? 1 : 0)) << 255) | s
        });
    }

    function _hashVoteData(
        address voter,
        bytes memory community,
        uint256 amount,
        uint256 timestamp
    )
        internal
        pure
        returns (bytes32)
    {
        return keccak256(abi.encode(VOTE_TYPEHASH, voter, keccak256(community), amount, timestamp));
    }

    function _getVoting(uint256 index) internal view returns (FeaturedVotingContract.Voting memory) {
        (
            uint256 id,
            uint256 startBlock,
            uint256 startAt,
            uint256 verificationStartAt,
            uint256 endAt,
            bool finalized,
            uint32 evaluatingPos,
            bool evaluated,
            uint256 endBlock
        ) = featuredVotingContract.votings(index);

        return FeaturedVotingContract.Voting({
            id: id,
            startBlock: startBlock,
            startAt: startAt,
            verificationStartAt: verificationStartAt,
            endAt: endAt,
            finalized: finalized,
            evaluatingPos: evaluatingPos,
            evaluated: evaluated,
            endBlock: endBlock
        });
    }

    function setUp() public virtual {
        DeployContracts deployment = new DeployContracts();
        (
            MiniMeToken _mockSNT,
            Directory _directory,
            VotingContract _votingContract,
            FeaturedVotingContract _featuredVotingContract
        ) = deployment.run();

        DeploymentConfig deploymentConfig = deployment.getDeploymentConfig();

        (,,, uint32 _featuredVotingLengthInSeconds, uint32 _featuredVotingVerificationLengthInSeconds,,,) =
            deploymentConfig.activeNetworkConfig();

        votingContract = address(_votingContract);
        featuredVotingLengthInSeconds = _featuredVotingLengthInSeconds;
        featuredVotingVerificationLengthInSeconds = _featuredVotingVerificationLengthInSeconds;
        votingWithVerificationLength = featuredVotingLengthInSeconds + featuredVotingVerificationLengthInSeconds;

        featuredVotingContract = _featuredVotingContract;
        directoryContract = _directory;

        mockSNT = _mockSNT;
        deployer = deploymentConfig.deployer();

        DOMAIN_SEPARATOR = _hashDomainData(block.chainid, address(featuredVotingContract));
        sigUtils = new SigUtils(DOMAIN_SEPARATOR);

        (address bob_, uint256 bobsKey_) = makeAddrAndKey("bob");
        (address alice_, uint256 alicesKey_) = makeAddrAndKey("alice");
        bob = bob_;
        bobsKey = bobsKey_;
        alice = alice_;
        alicesKey = alicesKey_;

        communityIDs = new bytes[](6);
        communityIDs[0] = bytes("0x0d9cb350e1dc415303e2816a21b0a439530725b4b2b42d2948e967cb211eab89d5");
        communityIDs[1] = bytes("0xe84e64498172551d998a220e1d8e5893c818ee9aa90bdb855aec0c9e65e89014b8");
        communityIDs[2] = bytes("0x04bbb77ea11ee6dc4585efa2617ec90b8ee4051ade4fcf7261ae6cd4cdf33e54e3");
        communityIDs[3] = bytes("0xadfcf42e083e71d8c755da07a2b1bad754d7ca97c35fbd407da6bde9844580ad55");
        communityIDs[4] = bytes("0xec62724b6828954a705eb3b531c30a69503d3561d4283fb8b60835ff34205c64d8");
        communityIDs[5] = bytes("0xb8def1f5e7160e5e1a6440912b7e633ad923030352f23abb54226020bff781b7e6");

        _ensureVoteTokens(bob, 100_000);
    }

    function _ensureVoteTokens(address owner, uint256 amount) internal {
        vm.prank(deployer);
        mockSNT.generateTokens(owner, amount);
    }
}

contract SetDirectoryTest is FeaturedVotingContractTest {
    function setUp() public virtual override {
        FeaturedVotingContractTest.setUp();
    }

    function test_RevertWhen_NotOwner() public {
        vm.expectRevert(bytes("Ownable: caller is not the owner"));
        vm.prank(bob);
        featuredVotingContract.setDirectory(directoryContract);
    }
}

contract InitializeVotingTest is FeaturedVotingContractTest {
    function setUp() public virtual override {
        FeaturedVotingContractTest.setUp();
    }

    function test_RevertWhen_VoteAlreadyOngoing() public {
        vm.prank(votingContract);
        directoryContract.addCommunity(communityIDs[0]);

        vm.startPrank(bob);
        featuredVotingContract.initializeVoting(communityIDs[0], 100);
        vm.expectRevert(bytes("vote already ongoing"));
        featuredVotingContract.initializeVoting(communityIDs[0], 100);
    }

    function test_RevertWhen_CommunityIsNotInDirectory() public {
        vm.expectRevert(bytes("community not in directory"));
        featuredVotingContract.initializeVoting(communityIDs[0], 100);
    }

    function test_RevertWhen_SenderHasNotEnoughFunds() public {
        vm.prank(votingContract);
        directoryContract.addCommunity(communityIDs[0]);
        // alice doesn't have any MockSNT
        vm.prank(alice);
        vm.expectRevert(bytes("not enough token"));
        featuredVotingContract.initializeVoting(communityIDs[0], 100);
    }

    function test_RevertWhen_CooldownPeriodHasNotPassed() public {
        vm.prank(votingContract);
        directoryContract.addCommunity(communityIDs[0]);

        vm.prank(bob);
        featuredVotingContract.initializeVoting(communityIDs[0], 100);
        skip(votingWithVerificationLength + 1);
        featuredVotingContract.finalizeVoting(1);

        vm.expectRevert(bytes("community has been featured recently"));
        vm.prank(bob);
        featuredVotingContract.initializeVoting(communityIDs[0], 100);
    }

    function test_InitializeVoting() public {
        vm.prank(votingContract);
        directoryContract.addCommunity(communityIDs[0]);

        vm.expectEmit(false, false, false, false);
        emit VotingStarted();
        vm.prank(bob);
        featuredVotingContract.initializeVoting(communityIDs[0], 100);

        FeaturedVotingContract.Voting memory voting = _getVoting(0);
        assertEq(voting.id, 1);
        assertEq(voting.startBlock, block.number);
        assertEq(voting.startAt, block.timestamp);
        assertEq(voting.verificationStartAt, block.timestamp + featuredVotingLengthInSeconds);
        assertEq(voting.endAt, block.timestamp + votingWithVerificationLength);
        assertFalse(voting.finalized);
        // ensure evaluation happens at initialization
        assert(voting.evaluated);
        assertEq(voting.evaluatingPos, 1);
    }

    function test_InitializeVoting_CooldownPeriodHasPassed() public {
        vm.prank(votingContract);
        directoryContract.addCommunity(communityIDs[0]);

        vm.prank(bob);
        featuredVotingContract.initializeVoting(communityIDs[0], 100);
        skip(votingWithVerificationLength + 1);
        featuredVotingContract.finalizeVoting(1);

        FeaturedVotingContract.Voting memory voting = _getVoting(0);
        assert(voting.finalized);
        assert(voting.evaluated);
        assertEq(voting.evaluatingPos, 1);

        // now initialize and finalize voting for another community
        // so we can initialize another voting using `communityIDs[0]` again
        vm.prank(votingContract);
        directoryContract.addCommunity(communityIDs[1]);

        vm.prank(bob);
        featuredVotingContract.initializeVoting(communityIDs[1], 100);
        skip(votingWithVerificationLength + 1);
        featuredVotingContract.finalizeVoting(1);

        voting = _getVoting(1);
        assert(voting.finalized);
        assert(voting.evaluated);
        assertEq(voting.evaluatingPos, 1);

        // try initialize voting that was already featured
        vm.prank(bob);
        featuredVotingContract.initializeVoting(communityIDs[0], 100);

        voting = _getVoting(2);
        assertFalse(voting.finalized);
        assert(voting.evaluated);
        assertEq(voting.evaluatingPos, 1);
    }
}

contract FinalizeVotingTest is FeaturedVotingContractTest {
    function setUp() public virtual override {
        FeaturedVotingContractTest.setUp();
    }

    function test_RevertWhen_NoOngoingVote() public {
        vm.expectRevert(bytes("no ongoing vote"));
        featuredVotingContract.finalizeVoting(1);
    }

    function test_RevertWhen_VoteStillOngoing() public {
        vm.prank(votingContract);
        directoryContract.addCommunity(communityIDs[0]);

        vm.prank(bob);
        featuredVotingContract.initializeVoting(communityIDs[0], 100);
        vm.expectRevert(bytes("vote still ongoing"));
        featuredVotingContract.finalizeVoting(1);
    }

    function test_FinalizeVoting() public {
        vm.prank(votingContract);
        directoryContract.addCommunity(communityIDs[0]);

        vm.prank(bob);
        featuredVotingContract.initializeVoting(communityIDs[0], 100);
        skip(votingWithVerificationLength + 1);
        vm.expectEmit(false, false, false, false);
        emit VotingFinalized();
        featuredVotingContract.finalizeVoting(1);

        FeaturedVotingContract.Voting[] memory votings = featuredVotingContract.getVotings();
        assertEq(votings.length, 1);
        assertEq(votings[0].id, 1);
        assert(votings[0].finalized);

        bytes[] memory featuredCommunities = directoryContract.getFeaturedCommunities();
        assertEq(featuredCommunities.length, 1);
        assertEq(featuredCommunities[0], communityIDs[0]);
    }

    function test_FinalizeVoting_FeatureByFirstCastedWhenVoteIsADraw() public {
        vm.startPrank(votingContract);
        directoryContract.addCommunity(communityIDs[1]);
        directoryContract.addCommunity(communityIDs[2]);
        directoryContract.addCommunity(communityIDs[3]);
        directoryContract.addCommunity(communityIDs[4]);
        directoryContract.addCommunity(communityIDs[5]);
        vm.stopPrank();

        vm.prank(bob);
        featuredVotingContract.initializeVoting(communityIDs[2], 100);
        FeaturedVotingContract.Voting[] memory votings = featuredVotingContract.getVotings();
        assertEq(votings.length, 1);
        assertEq(votings[0].id, 1);
        assert(votings[0].evaluated);
        assertEq(votings[0].evaluatingPos, 1);

        FeaturedVotingContract.SignedVote[] memory votes = new FeaturedVotingContract.SignedVote[](4);
        votes[0] = _createSignedVote(bobsKey, bob, communityIDs[3], 100, block.timestamp);
        votes[1] = _createSignedVote(bobsKey, bob, communityIDs[4], 100, block.timestamp);
        votes[2] = _createSignedVote(bobsKey, bob, communityIDs[1], 100, block.timestamp);
        votes[3] = _createSignedVote(bobsKey, bob, communityIDs[5], 100, block.timestamp);

        featuredVotingContract.castVotes(votes);
        votings = featuredVotingContract.getVotings();
        assert(votings[0].evaluated);
        assertEq(votings[0].evaluatingPos, 5);

        skip(votingWithVerificationLength + 1);

        vm.expectEmit(false, false, false, false);
        emit VotingFinalized();
        featuredVotingContract.finalizeVoting(5);

        votings = featuredVotingContract.getVotings();
        assertEq(votings.length, 1);
        assert(votings[0].finalized);
        assert(votings[0].evaluated);
        assertEq(votings[0].evaluatingPos, 5);

        bytes[] memory featuredCommunities = directoryContract.getFeaturedCommunities();
        assertEq(featuredCommunities.length, 3);

        // we expect that communities which have been voted for
        // first to make it into the featured list, if the vote is a draw
        assertEq(featuredCommunities[0], communityIDs[2]);
        assertEq(featuredCommunities[1], communityIDs[3]);
        assertEq(featuredCommunities[2], communityIDs[4]);
    }

    function test_FinalizeVoting_BatchProcessing() public {
        vm.startPrank(votingContract);
        directoryContract.addCommunity(communityIDs[1]);
        directoryContract.addCommunity(communityIDs[2]);
        directoryContract.addCommunity(communityIDs[3]);
        directoryContract.addCommunity(communityIDs[4]);
        directoryContract.addCommunity(communityIDs[5]);
        vm.stopPrank();

        vm.prank(bob);
        featuredVotingContract.initializeVoting(communityIDs[2], 100);
        FeaturedVotingContract.Voting[] memory votings = featuredVotingContract.getVotings();
        assertEq(votings.length, 1);
        assertEq(votings[0].id, 1);
        assert(votings[0].evaluated);
        assertEq(votings[0].evaluatingPos, 1);

        FeaturedVotingContract.SignedVote[] memory votes = new FeaturedVotingContract.SignedVote[](4);
        votes[0] = _createSignedVote(bobsKey, bob, communityIDs[3], 100, block.timestamp);
        votes[1] = _createSignedVote(bobsKey, bob, communityIDs[4], 100, block.timestamp);
        votes[2] = _createSignedVote(bobsKey, bob, communityIDs[1], 100, block.timestamp);
        votes[3] = _createSignedVote(bobsKey, bob, communityIDs[5], 100, block.timestamp);

        featuredVotingContract.castVotes(votes);
        votings = featuredVotingContract.getVotings();
        assert(votings[0].evaluated);
        assertEq(votings[0].evaluatingPos, 5);

        skip(votingWithVerificationLength + 1);

        // finalizing with a limit of 1 leaving 4 votes to be evaluated
        featuredVotingContract.finalizeVoting(1);
        votings = featuredVotingContract.getVotings();
        assert(votings[0].finalized);
        assertFalse(votings[0].evaluated);
        assertEq(votings[0].evaluatingPos, 1);

        // finalizing with a limit of 2 leaving 2 votes to be evaluated
        featuredVotingContract.finalizeVoting(2);
        votings = featuredVotingContract.getVotings();
        assert(votings[0].finalized);
        assertFalse(votings[0].evaluated);
        assertEq(votings[0].evaluatingPos, 3);

        // finalizing with a limit of 1 leaving 1 votes to be evaluated
        featuredVotingContract.finalizeVoting(1);
        votings = featuredVotingContract.getVotings();
        assert(votings[0].finalized);
        assertFalse(votings[0].evaluated);
        assertEq(votings[0].evaluatingPos, 4);

        // finalizing with a limit of 1 causing evaluation to finish
        vm.expectEmit(false, false, false, false);
        emit VotingFinalized();
        featuredVotingContract.finalizeVoting(1);
        votings = featuredVotingContract.getVotings();
        assert(votings[0].finalized);
        assert(votings[0].evaluated);
        assertEq(votings[0].evaluatingPos, 5);

        bytes[] memory featuredCommunities = directoryContract.getFeaturedCommunities();
        assertEq(featuredCommunities.length, 3);

        // we expect that communities which have been voted for
        // first to make it into the featured list, if the vote is a draw
        assertEq(featuredCommunities[0], communityIDs[2]);
        assertEq(featuredCommunities[1], communityIDs[3]);
        assertEq(featuredCommunities[2], communityIDs[4]);
    }
}

contract CastVotesTest is FeaturedVotingContractTest {
    function setUp() public virtual override {
        FeaturedVotingContractTest.setUp();
    }

    function test_RevertWhen_NoOngoingVote() public {
        FeaturedVotingContract.SignedVote[] memory votes = new FeaturedVotingContract.SignedVote[](0);
        vm.expectRevert(bytes("no ongoing vote"));
        featuredVotingContract.castVotes(votes);
    }

    function test_RevertWhen_VotingHasBeenClosedAlready() public {
        vm.prank(votingContract);
        directoryContract.addCommunity(communityIDs[0]);

        vm.prank(bob);
        featuredVotingContract.initializeVoting(communityIDs[0], 100);
        skip(votingWithVerificationLength + 1);

        FeaturedVotingContract.SignedVote[] memory votes = new FeaturedVotingContract.SignedVote[](1);
        votes[0] = _createSignedVote(bobsKey, bob, communityIDs[0], 200, block.timestamp);
        vm.expectRevert(bytes("vote closed"));
        featuredVotingContract.castVotes(votes);

        FeaturedVotingContract.Voting[] memory votings = featuredVotingContract.getVotings();
        assertEq(votings.length, 1);
        assert(votings[0].evaluated);
        assertEq(votings[0].evaluatingPos, 1);
    }

    function test_CastVotes_EmitInvalidSignature() public {
        vm.prank(votingContract);
        directoryContract.addCommunity(communityIDs[0]);
        vm.prank(bob);
        featuredVotingContract.initializeVoting(communityIDs[0], 100);

        FeaturedVotingContract.SignedVote[] memory votes = new FeaturedVotingContract.SignedVote[](1);
        // create broken signature with bob's key but alice's address
        votes[0] = _createSignedVote(bobsKey, alice, communityIDs[0], 200, block.timestamp);

        vm.expectEmit(false, false, false, true);
        emit InvalidSignature(communityIDs[0], alice);
        featuredVotingContract.castVotes(votes);
    }

    function test_CastVotes_CooldownPeriodHasNotPassed() public {
        vm.prank(votingContract);
        directoryContract.addCommunity(communityIDs[0]);

        // initialize and finalize first voting for communityIDs[0]
        vm.prank(bob);
        featuredVotingContract.initializeVoting(communityIDs[0], 100);
        skip(votingWithVerificationLength + 1);
        featuredVotingContract.finalizeVoting(1);

        // the idea is that, if `cooldownPeriod` == 1, then there had
        // to be at least 1 finished voting that didn't include `communityIDs[0]`
        // since we want a test that verifies `castVotes()` indeed emits
        // `CommunityFeaturedRecently` we need to first try to build a scenario
        // in which `initializeVoting()` isn't already emitting that same error,
        // yet a vote for `communityIDs[0]` should trigger the expected event.
        //
        // We try this by initializing a second voting that is not `communityIDs[0]`
        vm.prank(votingContract);
        directoryContract.addCommunity(communityIDs[1]);

        // initialize second voting not containing communityIDs[0]
        vm.prank(bob);
        featuredVotingContract.initializeVoting(communityIDs[1], 100);

        // cast a vote for `communityIDs[0]` to have `castVotes()` emit the expected
        // event
        FeaturedVotingContract.SignedVote[] memory votes = new FeaturedVotingContract.SignedVote[](1);
        votes[0] = _createSignedVote(bobsKey, bob, communityIDs[0], 200, block.timestamp);

        vm.expectEmit(false, false, false, true);
        emit CommunityFeaturedRecently(communityIDs[0], bob);
        featuredVotingContract.castVotes(votes);
    }

    function test_CastVotes_EmitInvalidVoteTimestamp() public {
        vm.prank(votingContract);
        directoryContract.addCommunity(communityIDs[0]);

        uint256 voteTimestamp = block.timestamp;
        FeaturedVotingContract.SignedVote[] memory votes = new FeaturedVotingContract.SignedVote[](1);
        votes[0] = _createSignedVote(bobsKey, bob, communityIDs[0], 200, voteTimestamp);

        // fast forward, such that vote timestamp will be earlier than the
        // voting room's startAt
        skip(1000);
        vm.prank(bob);
        featuredVotingContract.initializeVoting(communityIDs[0], 100);

        vm.expectRevert(bytes("invalid vote timestamp"));
        featuredVotingContract.castVotes(votes);

        // now create another failing vote that has a newer timestamp than the
        // voting room's verificationStartAt
        skip(featuredVotingLengthInSeconds + 1);
        votes[0] = _createSignedVote(bobsKey, bob, communityIDs[0], 200, block.timestamp);
        vm.expectRevert(bytes("invalid vote timestamp"));
        featuredVotingContract.castVotes(votes);
    }

    function test_CastVotes_EmitNotEnoughToken() public {
        vm.prank(votingContract);
        directoryContract.addCommunity(communityIDs[0]);

        vm.prank(bob);
        featuredVotingContract.initializeVoting(communityIDs[0], 100);

        FeaturedVotingContract.Voting[] memory votings = featuredVotingContract.getVotings();
        assertEq(votings.length, 1);
        assertEq(votings[0].id, 1);
        assertFalse(votings[0].finalized);
        assert(votings[0].evaluated);
        assertEq(votings[0].evaluatingPos, 1);

        FeaturedVotingContract.SignedVote[] memory votes = new FeaturedVotingContract.SignedVote[](1);

        votes[0] = _createSignedVote(alicesKey, alice, communityIDs[0], 200, block.timestamp);

        vm.expectEmit(false, false, false, true);
        emit NotEnoughToken(communityIDs[0], alice);
        featuredVotingContract.castVotes(votes);

        votings = featuredVotingContract.getVotings();
        assertFalse(votings[0].finalized);
        assert(votings[0].evaluated);
        assertEq(votings[0].evaluatingPos, 2);
    }
}

contract GetVotingsTest is FeaturedVotingContractTest {
    function setUp() public virtual override {
        FeaturedVotingContractTest.setUp();
    }

    function test_GetVotings() public {
        vm.startPrank(votingContract);
        directoryContract.addCommunity(communityIDs[0]);
        directoryContract.addCommunity(communityIDs[1]);
        vm.stopPrank();

        vm.prank(bob);
        featuredVotingContract.initializeVoting(communityIDs[0], 100);
        skip(votingWithVerificationLength + 1);
        featuredVotingContract.finalizeVoting(1);

        vm.prank(bob);
        featuredVotingContract.initializeVoting(communityIDs[1], 100);
        skip(votingWithVerificationLength + 1);
        featuredVotingContract.finalizeVoting(1);

        FeaturedVotingContract.Voting[] memory votings = featuredVotingContract.getVotings();
        assertEq(votings.length, 2);
        assertEq(votings[0].id, 1);
        assertEq(votings[0].startBlock, block.number);
        assert(votings[0].finalized);
        assertEq(votings[1].id, 2);
        assertEq(votings[1].startBlock, block.number);
        assert(votings[1].finalized);
    }
}

contract GetVotesByVotingIdTest is FeaturedVotingContractTest {
    function setUp() public virtual override {
        FeaturedVotingContractTest.setUp();
    }

    function test_GetVotesByVotingId() public {
        vm.startPrank(votingContract);
        directoryContract.addCommunity(communityIDs[0]);
        directoryContract.addCommunity(communityIDs[1]);
        vm.stopPrank();

        vm.prank(bob);
        featuredVotingContract.initializeVoting(communityIDs[0], 100);
        skip(votingWithVerificationLength + 1);
        featuredVotingContract.finalizeVoting(1);

        vm.prank(bob);
        featuredVotingContract.initializeVoting(communityIDs[1], 300);
        skip(votingWithVerificationLength + 1);
        featuredVotingContract.finalizeVoting(1);

        FeaturedVotingContract.Vote[] memory votes = featuredVotingContract.getVotesByVotingId(1);
        assertEq(votes.length, 1);
        assertEq(votes[0].community, communityIDs[0]);
        assertEq(votes[0].sntAmount, 100);

        votes = featuredVotingContract.getVotesByVotingId(2);
        assertEq(votes.length, 1);
        assertEq(votes[0].community, communityIDs[1]);
        assertEq(votes[0].sntAmount, 300);
    }
}

contract IsInCooldownPeriodTest is FeaturedVotingContractTest {
    function setUp() public virtual override {
        FeaturedVotingContractTest.setUp();
    }

    function test_IsInCooldownPeriod() public {
        vm.prank(votingContract);
        directoryContract.addCommunity(communityIDs[0]);

        vm.prank(bob);
        featuredVotingContract.initializeVoting(communityIDs[0], 100);
        skip(votingWithVerificationLength + 1);
        featuredVotingContract.finalizeVoting(1);

        vm.prank(votingContract);
        directoryContract.addCommunity(communityIDs[1]);

        vm.prank(bob);
        featuredVotingContract.initializeVoting(communityIDs[1], 100);
        skip(votingWithVerificationLength + 1);
        featuredVotingContract.finalizeVoting(1);

        assert(featuredVotingContract.isInCooldownPeriod(communityIDs[1]));
        assertFalse(featuredVotingContract.isInCooldownPeriod(communityIDs[0]));
    }
}
