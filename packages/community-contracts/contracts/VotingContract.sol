// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import { ECDSA } from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import { Ownable2Step } from "@openzeppelin/contracts/access/Ownable2Step.sol";
import { MiniMeToken } from "@vacp2p/minime/contracts/MiniMeToken.sol";
import { Directory } from "./Directory.sol";

contract VotingContract is Ownable2Step {
    using ECDSA for bytes32;

    enum VoteType {
        AGAINST,
        FOR
    }

    struct Vote {
        address voter;
        VoteType voteType;
        uint256 sntAmount;
    }

    struct VotingRoom {
        uint256 startBlock;
        uint256 startAt;
        uint256 verificationStartAt;
        uint256 endAt;
        VoteType voteType;
        bool finalized;
        bytes community;
        uint256 totalVotesFor;
        uint256 totalVotesAgainst;
        uint256 roomNumber;
        uint256 endBlock;
        uint32 evaluatingPos;
        bool evaluated;
    }

    struct SignedVote {
        address voter;
        uint256 roomIdAndType;
        uint256 sntAmount;
        uint256 timestamp;
        bytes32 r;
        bytes32 vs;
    }

    event VotingRoomStarted(uint256 roomId, bytes publicKey);
    event VotingRoomVerificationStarted(uint256 roomId, bytes publicKey);
    event VotingRoomFinalized(uint256 roomId, bytes publicKey, bool passed, VoteType voteType);

    event VoteCast(uint256 roomId, address voter);
    event NotEnoughToken(uint256 roomId, address voter);
    event AlreadyVoted(uint256 roomId, address voter);
    event InvalidSignature(uint256 roomId, address voter);

    Directory public directory;
    MiniMeToken public token;

    uint256 public votingLength;
    uint256 public votingVerificationLength;
    uint256 public timeBetweenVoting;

    VotingRoom[] public votingRooms;
    mapping(bytes => uint256) public activeRoomIDByCommunityID;
    mapping(bytes => uint256[]) private roomIDsByCommunityID;

    // @dev This mapping is only hydrated and dehydrated during `castVotes()`
    mapping(uint256 => uint32) private transientRoomIdToVotesCount;
    // @dev This array is only hydrated and dehydrated during `castVotes()`
    uint256[] private transientRoomIds;

    mapping(uint256 => Vote[]) private votesByRoomID;
    mapping(uint256 => mapping(address => bool)) private votedAddressesByRoomID;

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
        keccak256("Vote(uint256 roomIdAndType,uint256 sntAmount,address voter,uint256 timestamp)");

    function hash(SignedVote calldata vote) internal pure returns (bytes32) {
        return keccak256(abi.encode(VOTE_TYPEHASH, vote.roomIdAndType, vote.sntAmount, vote.voter, vote.timestamp));
    }

    function verifySignature(SignedVote calldata vote) internal view returns (bool) {
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, hash(vote)));
        return digest.recover(vote.r, vote.vs) == vote.voter;
    }

    constructor(
        MiniMeToken _token,
        uint256 _votingLength,
        uint256 _votingVerificationLength,
        uint256 _timeBetweenVoting
    ) {
        token = _token;
        votingLength = _votingLength;
        votingVerificationLength = _votingVerificationLength;
        timeBetweenVoting = _timeBetweenVoting;
        DOMAIN_SEPARATOR = hash(
            EIP712Domain({
                name: "Voting Contract",
                version: "1",
                chainId: block.chainid,
                verifyingContract: address(this)
            })
        );
    }

    function setDirectory(Directory _address) public onlyOwner {
        directory = _address;
    }

    /// Voting room with `ID` doesn't exist.
    error VotingRoomDoesntExist(uint256 ID);

    /// Room `ID` must be greater than 0.
    error InvalidRoomID(uint256 ID);

    modifier onlyIfVotingRoomExists(uint256 ID) {
        if (ID < 1) revert InvalidRoomID(ID);
        if (ID > votingRooms.length) revert VotingRoomDoesntExist(ID);
        _;
    }

    function _getVotingRoom(uint256 roomID) private view onlyIfVotingRoomExists(roomID) returns (VotingRoom storage) {
        return votingRooms[roomID - 1];
    }

    function getActiveVotingRoom(bytes calldata publicKey) public view returns (VotingRoom memory) {
        return _getVotingRoom(activeRoomIDByCommunityID[publicKey]);
    }

    function getActiveVotingRooms() public view returns (uint256[] memory) {
        uint256[] memory returnVotingRooms = new uint256[](votingRooms.length);
        uint256 count = 0;
        for (uint256 i = 0; i < votingRooms.length; i++) {
            if (!votingRooms[i].finalized || !votingRooms[i].evaluated) {
                returnVotingRooms[count] = votingRooms[i].roomNumber;
                count++;
            }
        }
        // Resize the array to remove any unused elements
        assembly {
            mstore(returnVotingRooms, count)
        }
        return returnVotingRooms;
    }

    function listRoomVoters(uint256 roomID) public view returns (address[] memory roomVoters) {
        roomVoters = new address[](votesByRoomID[roomID].length);
        for (uint256 i = 0; i < votesByRoomID[roomID].length; i++) {
            roomVoters[i] = votesByRoomID[roomID][i].voter;
        }
    }

    function getVotingHistory(bytes calldata publicKey) public view returns (VotingRoom[] memory returnVotingRooms) {
        returnVotingRooms = new VotingRoom[](roomIDsByCommunityID[publicKey].length);
        for (uint256 i = 0; i < roomIDsByCommunityID[publicKey].length; i++) {
            returnVotingRooms[i] = _getVotingRoom(roomIDsByCommunityID[publicKey][i]);
        }
    }

    function initializeVotingRoom(VoteType voteType, bytes calldata publicKey, uint256 voteAmount) public {
        require(activeRoomIDByCommunityID[publicKey] == 0, "vote already ongoing");
        if (voteType == VoteType.AGAINST) {
            require(directory.isCommunityInDirectory(publicKey), "Community not in directory");
        }
        if (voteType == VoteType.FOR) {
            require(!directory.isCommunityInDirectory(publicKey), "Community already in directory");
        }
        uint256 historyLength = roomIDsByCommunityID[publicKey].length;
        if (historyLength > 0) {
            uint256 roomId = roomIDsByCommunityID[publicKey][historyLength - 1];
            require(
                (block.timestamp - _getVotingRoom(roomId).endAt) > timeBetweenVoting, "Community was in a vote recently"
            );
        }
        require(token.balanceOf(msg.sender) >= voteAmount, "not enough token");

        uint256 votingRoomID = votingRooms.length + 1;

        activeRoomIDByCommunityID[publicKey] = votingRoomID;
        roomIDsByCommunityID[publicKey].push(votingRoomID);
        votesByRoomID[votingRoomID].push(Vote({ voter: msg.sender, voteType: VoteType.FOR, sntAmount: voteAmount }));
        votedAddressesByRoomID[votingRoomID][msg.sender] = true;

        votingRooms.push(
            VotingRoom({
                startBlock: block.number,
                startAt: block.timestamp,
                verificationStartAt: block.timestamp + votingLength,
                endAt: block.timestamp + votingLength + votingVerificationLength,
                voteType: voteType,
                finalized: false,
                community: publicKey,
                totalVotesFor: 0,
                totalVotesAgainst: 0,
                roomNumber: votingRoomID,
                endBlock: 0,
                evaluatingPos: 0,
                evaluated: false
            })
        );

        // initializing a voting room is equal to casting a single
        // vote, so a limit of `1` is sufficient here
        _evaluateVotes(_getVotingRoom(votingRoomID), 1);

        emit VotingRoomStarted(votingRoomID, publicKey);
    }

    function _evaluateVotes(VotingRoom storage votingRoom, uint32 limit) private returns (bool) {
        require(
            limit <= votesByRoomID[votingRoom.roomNumber].length - votingRoom.evaluatingPos,
            "limit is greater than votes length"
        );

        // evaluation of votes happens against current's block balance
        // unless finalization phase has started
        uint256 balanceOfAtBlock = block.number;

        if (votingRoom.finalized) {
            balanceOfAtBlock = votingRoom.endBlock;
        }

        uint32 i = 0;
        for (; i < limit; i++) {
            Vote storage vote = votesByRoomID[votingRoom.roomNumber][votingRoom.evaluatingPos + i];

            if (token.balanceOfAt(vote.voter, balanceOfAtBlock) >= vote.sntAmount) {
                if (vote.voteType == VoteType.FOR) {
                    votingRoom.totalVotesFor = votingRoom.totalVotesFor + vote.sntAmount;
                } else {
                    votingRoom.totalVotesAgainst = votingRoom.totalVotesAgainst + vote.sntAmount;
                }
            } else {
                emit NotEnoughToken(votingRoom.roomNumber, vote.voter);
            }
        }

        votingRoom.evaluatingPos += i;
        if (votingRoom.evaluatingPos == votesByRoomID[votingRoom.roomNumber].length) {
            votingRoom.evaluated = true;
        }
        return votingRoom.totalVotesFor > votingRoom.totalVotesAgainst;
    }

    function _populateDirectory(VotingRoom storage votingRoom) private {
        if (votingRoom.voteType == VoteType.FOR) {
            directory.addCommunity(votingRoom.community);
        } else {
            directory.removeCommunity(votingRoom.community);
        }
    }

    function finalizeVotingRoom(uint256 roomId, uint32 limit) public {
        VotingRoom storage votingRoom = _getVotingRoom(roomId);

        if (!votingRoom.finalized) {
            require(votingRoom.endAt < block.timestamp, "vote still ongoing");
            votingRoom.finalized = true;
            votingRoom.endAt = block.timestamp;
            votingRoom.endBlock = block.number;

            // resetting evaluation state as we're not entering finalization
            // phase in which all votes have to be reevaluated
            votingRoom.evaluatingPos = 0;
            votingRoom.evaluated = false;
            votingRoom.totalVotesFor = 0;
            votingRoom.totalVotesAgainst = 0;
        }

        require(!votingRoom.evaluated, "vote already finalized");

        bool passed = _evaluateVotes(votingRoom, limit);
        if (votingRoom.evaluated) {
            activeRoomIDByCommunityID[votingRoom.community] = 0;
            if (passed) {
                _populateDirectory(votingRoom);
            }
            emit VotingRoomFinalized(roomId, votingRoom.community, passed, votingRoom.voteType);
        }
    }

    function castVote(SignedVote calldata vote) private returns (bool) {
        if (!verifySignature(vote)) {
            emit InvalidSignature(vote.roomIdAndType >> 1, vote.voter);
            return false;
        }

        uint256 roomId = vote.roomIdAndType >> 1;
        VotingRoom storage room = _getVotingRoom(roomId);

        require(block.timestamp < room.endAt, "vote closed");
        require(!room.finalized, "room finalized");
        require(vote.timestamp < room.verificationStartAt, "invalid vote timestamp");
        require(vote.timestamp >= room.startAt, "invalid vote timestamp");

        if (votedAddressesByRoomID[roomId][vote.voter]) {
            emit AlreadyVoted(roomId, vote.voter);
            return false;
        }

        votedAddressesByRoomID[roomId][vote.voter] = true;
        votesByRoomID[roomId].push(
            Vote({
                voter: vote.voter,
                voteType: vote.roomIdAndType & 1 == 1 ? VoteType.FOR : VoteType.AGAINST,
                sntAmount: vote.sntAmount
            })
        );

        emit VoteCast(roomId, vote.voter);
        return true;
    }

    function castVotes(SignedVote[] calldata votes) public {
        // @dev used to keep track of how many different rooms have
        // been voted for.
        uint16 roomIdCount = 0;

        for (uint256 i = 0; i < votes.length; i++) {
            bool success = castVote(votes[i]);
            if (success) {
                uint256 roomId = votes[i].roomIdAndType >> 1;
                if (transientRoomIdToVotesCount[roomId] == 0) {
                    roomIdCount += 1;
                    transientRoomIds.push(roomId);
                }
                transientRoomIdToVotesCount[roomId] += 1;
            }
        }

        // evaluate newly casted votes on a per room bases
        for (uint16 i = 0; i < roomIdCount; i++) {
            uint256 _roomId = transientRoomIds[i];
            VotingRoom storage votingRoom = _getVotingRoom(_roomId);
            _evaluateVotes(votingRoom, transientRoomIdToVotesCount[_roomId]);
            // clean up transient storage
            delete transientRoomIdToVotesCount[_roomId];
        }
        delete transientRoomIds;
    }
}
