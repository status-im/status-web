// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import { ECDSA } from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import { Ownable2Step } from "@openzeppelin/contracts/access/Ownable2Step.sol";
import { MiniMeToken } from "@vacp2p/minime/contracts/MiniMeToken.sol";
import { Directory } from "./Directory.sol";

contract FeaturedVotingContract is Ownable2Step {
    using ECDSA for bytes32;

    struct Voting {
        uint256 id;
        uint256 startBlock;
        uint256 startAt;
        uint256 verificationStartAt;
        uint256 endAt;
        bool finalized;
        uint32 evaluatingPos;
        bool evaluated;
        uint256 endBlock;
    }

    struct Vote {
        address voter;
        bytes community;
        uint256 sntAmount;
    }

    struct SignedVote {
        address voter;
        bytes community;
        uint256 sntAmount;
        uint256 timestamp;
        bytes32 r;
        bytes32 vs;
    }

    struct CommunityVotes {
        bytes community;
        uint256 totalSntAmount; // make it snt agnostic
    }

    event VotingStarted();
    event VotingFinalized();

    event VoteCast(bytes community, address voter);
    event NotEnoughToken(bytes community, address voter);
    event AlreadyVoted(bytes community, address voter);
    event InvalidSignature(bytes community, address voter);
    event CommunityFeaturedRecently(bytes community, address voter);
    event CommunityNotInDirectory(bytes community, address voter); // TODO: use me

    Directory public directory;
    MiniMeToken public token;

    uint256 public votingLength;
    uint256 public votingVerificationLength;
    uint256 public featuredPerVotingCount;
    uint256 public cooldownPeriod;

    CommunityVotes[] private communitiesVotes;
    uint256 private communitiesVotesCount = 0;

    Voting[] public votings;
    mapping(uint256 => Vote[]) private votesByVotingID;
    mapping(uint256 => bytes[]) private featuredByVotingID;
    mapping(uint256 => mapping(bytes => mapping(address => bool))) private votersByCommunityByVotingID;

    bytes32 private constant EIP712DOMAIN_TYPEHASH =
        keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");

    struct EIP712Domain {
        string name;
        string version;
        uint256 chainId;
        address verifyingContract;
    }

    bytes32 private DOMAIN_SEPARATOR;

    function hash(EIP712Domain memory eip712Domain) internal pure returns (bytes32) {
        return keccak256(
            abi.encode(
                EIP712DOMAIN_TYPEHASH,
                keccak256(bytes(eip712Domain.name)),
                keccak256(bytes(eip712Domain.version)),
                eip712Domain.chainId,
                eip712Domain.verifyingContract
            )
        );
    }

    bytes32 public constant VOTE_TYPEHASH =
        keccak256("Vote(address voter,bytes community,uint256 sntAmount,uint256 timestamp)");

    function hash(SignedVote calldata vote) internal pure returns (bytes32) {
        return
            keccak256(abi.encode(VOTE_TYPEHASH, vote.voter, keccak256(vote.community), vote.sntAmount, vote.timestamp));
    }

    function verifySignature(SignedVote calldata vote) internal view returns (bool) {
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, hash(vote)));
        return digest.recover(vote.r, vote.vs) == vote.voter;
    }

    constructor(
        MiniMeToken _token,
        uint256 _votingLength,
        uint256 _votingVerificationLength,
        uint256 _cooldownPeriod,
        uint256 _featuredPerVotingCount
    ) {
        token = _token;
        votingLength = _votingLength;
        votingVerificationLength = _votingVerificationLength;
        cooldownPeriod = _cooldownPeriod;
        featuredPerVotingCount = _featuredPerVotingCount;
        DOMAIN_SEPARATOR = hash(
            EIP712Domain({
                name: "Featured Voting Contract",
                version: "1",
                chainId: block.chainid,
                verifyingContract: address(this)
            })
        );
    }

    function setDirectory(Directory _address) public onlyOwner {
        directory = _address;
    }

    function initializeVoting(bytes calldata publicKey, uint256 voteAmount) public {
        require(votings.length == 0 || votings[votings.length - 1].finalized, "vote already ongoing");
        require(directory.isCommunityInDirectory(publicKey), "community not in directory");
        require(!isInCooldownPeriod(publicKey), "community has been featured recently");
        require(token.balanceOf(msg.sender) >= voteAmount, "not enough token");

        uint256 votingID = votings.length + 1;

        votersByCommunityByVotingID[votingID][publicKey][msg.sender] = true;
        votesByVotingID[votingID].push(Vote({ voter: msg.sender, community: publicKey, sntAmount: voteAmount }));
        votings.push(
            Voting({
                id: votingID,
                startBlock: block.number,
                startAt: block.timestamp,
                verificationStartAt: block.timestamp + votingLength,
                endAt: block.timestamp + votingLength + votingVerificationLength,
                finalized: false,
                evaluatingPos: 0,
                evaluated: false,
                endBlock: 0
            })
        );

        // initializing a voting is equal to casting a single
        // vote, so a limit of `1` is sufficient here
        _evaluateVotes(1);

        emit VotingStarted();
    }

    function finalizeVoting(uint32 limit) public {
        require(votings.length > 0, "no ongoing vote");
        Voting storage voting = votings[votings.length - 1];

        if (!voting.finalized) {
            require(voting.endAt < block.timestamp, "vote still ongoing");
            voting.finalized = true;
            voting.endAt = block.timestamp;
            voting.endBlock = block.number;
            voting.evaluatingPos = 0;
            voting.evaluated = false;
        }

        require(!voting.evaluated, "vote already finalized");
        _evaluateVotes(limit);

        if (voting.evaluated) {
            bytes[] storage featured = featuredByVotingID[voting.id];

            for (uint256 i = 0; i < featuredPerVotingCount; i++) {
                uint256 highestIndex = 0;

                for (uint256 j = 1; j < communitiesVotesCount; j++) {
                    if (communitiesVotes[j].totalSntAmount > communitiesVotes[highestIndex].totalSntAmount) {
                        highestIndex = j;
                    }
                }

                if (communitiesVotes[highestIndex].totalSntAmount == 0) {
                    break;
                }

                featured.push(communitiesVotes[highestIndex].community);
                communitiesVotes[highestIndex].totalSntAmount = 0;
            }

            directory.setFeaturedCommunities(featured);

            // clean up storage for next voting
            communitiesVotesCount = 0;
            delete communitiesVotes;

            emit VotingFinalized();
        }
    }

    function castVotes(SignedVote[] calldata votes) public {
        require(votings.length > 0 && !votings[votings.length - 1].finalized, "no ongoing vote");

        uint32 successVotesCount = 0;
        for (uint256 i = 0; i < votes.length; i++) {
            bool success = _castVote(votes[i]);
            if (success) {
                successVotesCount += 1;
            }
        }
        _evaluateVotes(successVotesCount);
    }

    function getVotings() public view returns (Voting[] memory) {
        return votings;
    }

    function getVotesByVotingId(uint256 votingID) public view returns (Vote[] memory) {
        return votesByVotingID[votingID];
    }

    function _min(uint256 a, uint256 b) private pure returns (uint256) {
        return a < b ? a : b;
    }

    function isInCooldownPeriod(bytes calldata publicKey) public view returns (bool) {
        if (votings.length == 0) {
            return false;
        }
        // don't count the active voting
        uint256 votingsCount = votings[votings.length - 1].finalized ? cooldownPeriod : cooldownPeriod + 1;
        votingsCount = _min(votings.length, votingsCount);
        for (uint256 i = 0; i < votingsCount; i++) {
            bytes[] storage featured = featuredByVotingID[votings[votings.length - i - 1].id];
            for (uint256 j = 0; j < featured.length; j++) {
                if (_compareBytes(featured[j], publicKey)) {
                    return true;
                }
            }
        }
        return false;
    }

    function _compareBytes(bytes memory a, bytes memory b) private pure returns (bool) {
        if (a.length != b.length) {
            return false;
        }
        for (uint256 i = 0; i < a.length; i++) {
            if (a[i] != b[i]) {
                return false;
            }
        }
        return true;
    }

    function _evaluateVotes(uint32 limit) private {
        Voting storage voting = votings[votings.length - 1];
        Vote[] storage votes = votesByVotingID[voting.id];

        require(limit <= votes.length - voting.evaluatingPos, "limit is greater than votes length");

        // evaluation of votes happens against current's block balance
        // unless finalization phase has started
        uint256 balanceOfAtBlock = block.number;

        if (voting.finalized) {
            balanceOfAtBlock = voting.endBlock;
        }

        uint32 i = 0;
        for (; i < limit; i++) {
            Vote storage vote = votes[voting.evaluatingPos + i];
            if (token.balanceOfAt(vote.voter, balanceOfAtBlock) < vote.sntAmount) {
                emit NotEnoughToken(vote.community, vote.voter);
                continue;
            }

            bool found = false;
            for (uint256 j = 0; j < communitiesVotesCount; j++) {
                if (_compareBytes(vote.community, communitiesVotes[j].community)) {
                    communitiesVotes[j].totalSntAmount += vote.sntAmount;
                    found = true;
                    break;
                }
            }
            if (!found) {
                communitiesVotes.push(CommunityVotes({ community: vote.community, totalSntAmount: vote.sntAmount }));
                communitiesVotesCount++;
            }
        }

        voting.evaluatingPos += i;
        if (voting.evaluatingPos == votes.length) {
            voting.evaluated = true;
        }
    }

    function _castVote(SignedVote calldata vote) private returns (bool) {
        if (!verifySignature(vote)) {
            emit InvalidSignature(vote.community, vote.voter);
            return false;
        }

        if (!directory.isCommunityInDirectory(vote.community)) {
            emit CommunityNotInDirectory(vote.community, vote.voter);
            return false;
        }

        if (isInCooldownPeriod(vote.community)) {
            emit CommunityFeaturedRecently(vote.community, vote.voter);
            return false;
        }

        Voting storage voting = votings[votings.length - 1];

        require(block.timestamp < voting.endAt, "vote closed");
        require(!voting.finalized, "room finalized");
        require(vote.timestamp < voting.verificationStartAt, "invalid vote timestamp");
        require(vote.timestamp >= voting.startAt, "invalid vote timestamp");

        if (votersByCommunityByVotingID[voting.id][vote.community][vote.voter]) {
            emit AlreadyVoted(vote.community, vote.voter);
            return false;
        }

        votersByCommunityByVotingID[voting.id][vote.community][vote.voter] = true;
        votesByVotingID[voting.id].push(
            Vote({ voter: vote.voter, community: vote.community, sntAmount: vote.sntAmount })
        );

        emit VoteCast(vote.community, vote.voter);
        return true;
    }
}
