// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import { Test } from "forge-std/Test.sol";
import { DeployContracts } from "../script/DeployContracts.s.sol";
import { DeploymentConfig } from "../script/DeploymentConfig.s.sol";
import { Directory } from "../contracts/Directory.sol";
import { VotingContract } from "../contracts/VotingContract.sol";
import { FeaturedVotingContract } from "../contracts/FeaturedVotingContract.sol";

contract DirectoryTest is Test {
    Directory public directory;
    address internal votingContract;
    address internal featuredVotingContract;
    address internal deployer;

    bytes internal communityID = "communityID";
    bytes internal communityID2 = "communityID2";
    bytes internal communityID3 = "communityID3";

    function setUp() public virtual {
        DeployContracts deployment = new DeployContracts();
        (, Directory _directory, VotingContract _votingContract, FeaturedVotingContract _featuredVotingContract) =
            deployment.run();
        directory = _directory;
        votingContract = address(_votingContract);
        featuredVotingContract = address(_featuredVotingContract);

        DeploymentConfig deploymentConfig = deployment.getDeploymentConfig();
        deployer = deploymentConfig.deployer();
    }

    function _addCommunitiesToDirectory(bytes[] memory communityIDs) internal {
        vm.startPrank(votingContract);
        for (uint8 i = 0; i < communityIDs.length; i++) {
            directory.addCommunity(communityIDs[i]);
        }
        vm.stopPrank();
        for (uint8 i = 0; i < communityIDs.length; i++) {
            assert(directory.isCommunityInDirectory(communityIDs[i]));
        }
    }

    function testDeployment() public {
        assertEq(directory.owner(), deployer);
        assertEq(directory.votingContract(), votingContract);
        assertEq(directory.featuredVotingContract(), featuredVotingContract);
    }
}

contract IsCommunityInDirectoryTest is DirectoryTest {
    function setUp() public virtual override {
        DirectoryTest.setUp();
    }

    function test_IsInCommunityDirectory() public {
        vm.startPrank(votingContract);
        directory.addCommunity(communityID);
        vm.stopPrank();
        assert(directory.isCommunityInDirectory(communityID));
    }
}

contract IsCommunityFeaturedTest is DirectoryTest {
    function setUp() public virtual override {
        DirectoryTest.setUp();
    }

    function test_IsCommunityFeatured() public {
        vm.startPrank(votingContract);
        directory.addCommunity(communityID);
        directory.addCommunity(communityID2);
        vm.stopPrank();

        bytes[] memory toFeature = new bytes[](1);
        toFeature[0] = communityID;

        assertFalse(directory.isCommunityFeatured(communityID));

        vm.prank(featuredVotingContract);
        directory.setFeaturedCommunities(toFeature);

        assert(directory.isCommunityFeatured(communityID));
        assertFalse(directory.isCommunityFeatured(communityID2));
    }
}

contract GetCommunitiesTest is DirectoryTest {
    function setUp() public virtual override {
        DirectoryTest.setUp();
    }

    function test_GetCommunities() public {
        vm.prank(votingContract);
        directory.addCommunity(communityID);
        assertEq(directory.getCommunities()[0], communityID);
    }
}

contract GetFeaturedCommunitiesTest is DirectoryTest {
    function setUp() public virtual override {
        DirectoryTest.setUp();
    }

    function test_GetFeaturedCommunities() public {
        vm.startPrank(votingContract);
        directory.addCommunity(communityID);
        directory.addCommunity(communityID2);
        vm.stopPrank();

        bytes[] memory toFeature = new bytes[](2);
        toFeature[0] = communityID;
        toFeature[1] = communityID2;

        vm.prank(featuredVotingContract);
        directory.setFeaturedCommunities(toFeature);

        assertEq(directory.getFeaturedCommunities()[0], communityID);
        assertEq(directory.getFeaturedCommunities()[1], communityID2);
    }
}

contract AddCommunityTest is DirectoryTest {
    function setUp() public virtual override {
        DirectoryTest.setUp();
    }

    function test_RevertWhen_SenderIsNotVotingContract() public {
        vm.expectRevert(bytes("Invalid sender"));
        directory.addCommunity(communityID);
    }

    function test_RevertWhen_CommunityAlreadyExists() public {
        vm.startPrank(votingContract);

        directory.addCommunity(communityID);
        vm.expectRevert(bytes("Community already exist"));
        directory.addCommunity(communityID);
        vm.stopPrank();
    }

    function test_AddCommunity() public {
        vm.startPrank(votingContract);

        directory.addCommunity(communityID);
        vm.stopPrank();

        assertEq(directory.getCommunities()[0], communityID);
        assert(directory.isCommunityInDirectory(communityID));
    }
}

contract RemoveCommunityTest is DirectoryTest {
    function setUp() public virtual override {
        DirectoryTest.setUp();
    }

    function test_RevertWhen_SenderIsNotVotingContract() public {
        vm.startPrank(votingContract);
        directory.addCommunity(communityID);
        vm.stopPrank();
        // no longer impersonating votingContract
        vm.expectRevert(bytes("Invalid sender"));
        directory.removeCommunity(communityID);
    }

    function test_RemoveCommunity() public {
        vm.startPrank(votingContract);

        directory.addCommunity(communityID);
        directory.addCommunity(communityID2);
        directory.addCommunity(communityID3);

        directory.removeCommunity(communityID2);
        vm.stopPrank();
        assertEq(directory.getCommunities()[1], communityID3);
        assertFalse(directory.isCommunityInDirectory(communityID2));
    }

    function test_RemoveCommunity_ShouldRemoveFeaturedCommunity() public {
        vm.startPrank(votingContract);
        directory.addCommunity(communityID);
        directory.addCommunity(communityID2);
        directory.addCommunity(communityID3);
        vm.stopPrank();

        bytes[] memory toFeature = new bytes[](3);
        toFeature[0] = communityID;
        toFeature[1] = communityID2;
        toFeature[2] = communityID3;

        vm.prank(featuredVotingContract);
        directory.setFeaturedCommunities(toFeature);

        vm.startPrank(votingContract);
        directory.removeCommunity(communityID);
        directory.removeCommunity(communityID2);
        directory.removeCommunity(communityID3);
        vm.stopPrank();

        assertFalse(directory.isCommunityInDirectory(communityID));
        assertFalse(directory.isCommunityInDirectory(communityID2));
        assertFalse(directory.isCommunityInDirectory(communityID3));
        assertFalse(directory.isCommunityFeatured(communityID));
        assertFalse(directory.isCommunityFeatured(communityID2));
        assertFalse(directory.isCommunityFeatured(communityID3));
    }
}

contract SetFeaturedCommunitiesTest is DirectoryTest {
    function setUp() public virtual override {
        DirectoryTest.setUp();
    }

    function test_RevertWhen_SenderIsNotFeaturedVotingContract() public {
        bytes[] memory toFeature = new bytes[](3);
        toFeature[0] = communityID;
        toFeature[1] = communityID2;
        toFeature[2] = communityID3;

        vm.prank(votingContract);
        vm.expectRevert(bytes("Invalid sender"));
        directory.setFeaturedCommunities(toFeature);
    }

    function test_RevertWhen_CommunitiesAreNotInDirectory() public {
        bytes[] memory toFeature = new bytes[](1);
        toFeature[0] = communityID;

        vm.prank(featuredVotingContract);
        vm.expectRevert(bytes("Community not in directory"));
        directory.setFeaturedCommunities(toFeature);
    }

    function test_SetFeaturedCommunities() public {
        bytes[] memory toAdd = new bytes[](3);
        toAdd[0] = communityID;
        toAdd[1] = communityID2;
        toAdd[2] = communityID3;

        bytes[] memory toFeature = new bytes[](3);
        toFeature[0] = communityID;
        toFeature[1] = communityID2;
        toFeature[2] = communityID3;

        _addCommunitiesToDirectory(toAdd);

        vm.prank(featuredVotingContract);
        directory.setFeaturedCommunities(toFeature);

        assert(directory.isCommunityFeatured(communityID));
        assert(directory.isCommunityFeatured(communityID2));
        assert(directory.isCommunityFeatured(communityID3));
    }

    function test_SetFeaturedCommunities_ShouldOverridePreviousFeaturedCommunities() public {
        bytes[] memory toAdd = new bytes[](3);
        toAdd[0] = communityID;
        toAdd[1] = communityID2;
        toAdd[2] = communityID3;

        bytes[] memory toFeature = new bytes[](3);
        toFeature[0] = communityID;
        toFeature[1] = communityID2;
        toFeature[2] = communityID3;

        _addCommunitiesToDirectory(toAdd);

        vm.prank(featuredVotingContract);
        directory.setFeaturedCommunities(toFeature);
        assert(directory.isCommunityFeatured(communityID));
        assert(directory.isCommunityFeatured(communityID2));
        assert(directory.isCommunityFeatured(communityID3));

        bytes memory communityID4 = bytes("communityID4");
        bytes memory communityID5 = bytes("communityID5");
        bytes memory communityID6 = bytes("communityID6");

        toAdd[0] = communityID4;
        toAdd[1] = communityID5;
        toAdd[2] = communityID6;

        _addCommunitiesToDirectory(toAdd);

        toFeature[0] = communityID4;
        toFeature[1] = communityID5;
        toFeature[2] = communityID6;

        vm.prank(featuredVotingContract);
        directory.setFeaturedCommunities(toFeature);

        assertFalse(directory.isCommunityFeatured(communityID));
        assertFalse(directory.isCommunityFeatured(communityID2));
        assertFalse(directory.isCommunityFeatured(communityID3));
        assert(directory.isCommunityFeatured(communityID4));
        assert(directory.isCommunityFeatured(communityID5));
        assert(directory.isCommunityFeatured(communityID6));
    }
}
