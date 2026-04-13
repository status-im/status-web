// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract SigUtils {
    enum VoteType {
        AGAINST,
        FOR
    }

    // solhint-disable-next-line var-name-mixedcase
    bytes32 internal DOMAIN_SEPARATOR;

    // solhint-disable-next-line var-name-mixedcase
    bytes32 internal constant EIP712DOMAIN_TYPEHASH =
        keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");

    // solhint-disable-next-line var-name-mixedcase
    constructor(bytes32 _DOMAIN_SEPARATOR) {
        DOMAIN_SEPARATOR = _DOMAIN_SEPARATOR;
    }

    // solhint-disable-next-line var-name-mixedcase
    bytes32 internal constant VOTE_TYPEHASH =
        keccak256("Vote(uint256 roomIdAndType,uint256 sntAmount,address voter,uint256 timestamp)");

    struct Vote {
        address voter;
        VoteType voteType;
        uint256 sntAmount;
    }

    function getStructHash(Vote memory _vote, uint256 _roomId, uint256 _timestamp) internal pure returns (bytes32) {
        return keccak256(abi.encode(VOTE_TYPEHASH, _roomId, _vote.sntAmount, _vote.voter, _timestamp));
    }

    function getTypedDataHash(Vote memory _vote, uint256 _roomId, uint256 _timestamp) public view returns (bytes32) {
        return keccak256(abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, getStructHash(_vote, _roomId, _timestamp)));
    }

    bytes32 public constant FEATURED_VOTE_TYPEHASH =
        keccak256("Vote(address voter,bytes community,uint256 sntAmount,uint256 timestamp)");

    struct FeaturedVote {
        address voter;
        bytes community;
        uint256 sntAmount;
    }

    function getStructHash(FeaturedVote memory _vote, uint256 _timestamp) internal pure returns (bytes32) {
        return keccak256(
            abi.encode(FEATURED_VOTE_TYPEHASH, _vote.voter, keccak256(_vote.community), _vote.sntAmount, _timestamp)
        );
    }

    function getTypedDataHash(FeaturedVote memory _vote, uint256 _timestamp) public view returns (bytes32) {
        return keccak256(abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, getStructHash(_vote, _timestamp)));
    }
}
