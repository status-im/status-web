// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import { Ownable2Step } from "@openzeppelin/contracts/access/Ownable2Step.sol";

contract Directory is Ownable2Step {
    address public votingContract;
    address public featuredVotingContract;

    bytes[] private communities;
    mapping(bytes => uint256) private communitiesIdx;
    bytes[] private featuredCommunities;
    mapping(bytes => uint256) private featuredCommunitiesIdx;

    constructor(address _votingContract, address _featuredVotingContract) {
        votingContract = _votingContract;
        featuredVotingContract = _featuredVotingContract;
    }

    function isCommunityInDirectory(bytes calldata community) public view returns (bool) {
        return communitiesIdx[community] > 0;
    }

    function isCommunityFeatured(bytes calldata community) public view returns (bool) {
        return featuredCommunitiesIdx[community] > 0;
    }

    function getCommunities() public view returns (bytes[] memory) {
        return communities;
    }

    function getFeaturedCommunities() public view returns (bytes[] memory) {
        return featuredCommunities;
    }

    modifier onlyVotingContract() {
        require(msg.sender == votingContract, "Invalid sender");
        _;
    }

    modifier onlyFeaturedVotingContract() {
        require(msg.sender == featuredVotingContract, "Invalid sender");
        _;
    }

    function addCommunity(bytes calldata community) public onlyVotingContract {
        require(communitiesIdx[community] == 0, "Community already exist");
        communities.push(community);
        communitiesIdx[community] = communities.length;
    }

    function removeCommunity(bytes calldata community) public onlyVotingContract {
        _removeFromList(community, communities, communitiesIdx);
        _removeFromList(community, featuredCommunities, featuredCommunitiesIdx);
    }

    function setFeaturedCommunities(bytes[] calldata _featuredCommunities) public onlyFeaturedVotingContract {
        for (uint256 i = 0; i < featuredCommunities.length; i++) {
            delete (featuredCommunitiesIdx[featuredCommunities[i]]);
        }
        delete featuredCommunities;
        for (uint256 i = 0; i < _featuredCommunities.length; i++) {
            require(isCommunityInDirectory(_featuredCommunities[i]), "Community not in directory");
            featuredCommunities.push(_featuredCommunities[i]);
            featuredCommunitiesIdx[_featuredCommunities[i]] = i + 1;
        }
    }

    function _removeFromList(
        bytes memory item,
        bytes[] storage list,
        mapping(bytes => uint256) storage listIdx
    )
        private
    {
        uint256 index = listIdx[item];
        if (index == 0) return;
        index--;

        if (list.length > 1) {
            list[index] = list[list.length - 1];
            listIdx[list[index]] = index + 1;
        }

        list.pop();
        listIdx[item] = 0;
    }
}
