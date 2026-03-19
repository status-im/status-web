// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.19;

import { console } from "forge-std/Test.sol";
import { MiniMeToken } from "@vacp2p/minime/contracts/MiniMeToken.sol";
import { DeploymentConfig } from "./DeploymentConfig.s.sol";
import { BaseScript } from "./Base.s.sol";

import { Directory } from "../contracts/Directory.sol";
import { FeaturedVotingContract } from "../contracts/FeaturedVotingContract.sol";
import { VotingContract } from "../contracts/VotingContract.sol";

contract DeployContracts is BaseScript {
    DeploymentConfig internal deploymentConfig;

    function getDeploymentConfig() public returns (DeploymentConfig) {
        if (address(deploymentConfig) == address(0)) {
            deploymentConfig = new DeploymentConfig(broadcaster);
        }
        return deploymentConfig;
    }

    function run() external returns (MiniMeToken, Directory, VotingContract, FeaturedVotingContract) {
        deploymentConfig = getDeploymentConfig();
        (
            uint32 votingLengthInSeconds,
            uint32 votingVerificationLength,
            uint32 timeBetweenVotingInSeconds,
            uint32 featuredVotingLength,
            uint32 featuredVotingVerificationLength,
            uint8 cooldownPeriod,
            uint8 featuredPerVotingCount,
            address tokenAddress
        ) = deploymentConfig.activeNetworkConfig();
        MiniMeToken minimeToken = MiniMeToken(payable(tokenAddress));

        vm.startBroadcast(broadcaster);

        VotingContract votingContract = new VotingContract(
            minimeToken,
            votingLengthInSeconds, 
            votingVerificationLength, 
            timeBetweenVotingInSeconds
        );
        FeaturedVotingContract featuredVotingContract = new FeaturedVotingContract(
            minimeToken,
            featuredVotingLength,
            featuredVotingVerificationLength,
            cooldownPeriod,
            featuredPerVotingCount
        );
        Directory directoryContract = new Directory(address(votingContract), address(featuredVotingContract));

        votingContract.setDirectory(directoryContract);
        featuredVotingContract.setDirectory(directoryContract);
        vm.stopBroadcast();

        console.log("contract Multicall2", deploymentConfig.getMulticallAddress());
        return (minimeToken, directoryContract, votingContract, featuredVotingContract);
    }
}
