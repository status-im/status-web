//// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.19;

import { Script } from "forge-std/Script.sol";
import { MiniMeTokenFactory } from "@vacp2p/minime/contracts/MiniMeTokenFactory.sol";
import { MiniMeToken } from "@vacp2p/minime/contracts/MiniMeToken.sol";
import { Multicall2 } from "../contracts/Multicall2.sol";

contract DeploymentConfig is Script {
    error DeploymentConfig__InvalidMulticallAddress();

    NetworkConfig public activeNetworkConfig;

    struct NetworkConfig {
        uint32 votingLengthInSeconds;
        uint32 votingVerificationLengthInSeconds;
        uint32 timeBetweenVotingInSeconds;
        uint32 featuredVotingLengthInSeconds;
        uint32 featuredVotingVerificationLengthInSeconds;
        uint8 cooldownPeriod;
        uint8 featuredPerVotingCount;
        address voteToken;
    }

    uint32 internal constant TWO_DAYS_IN_SECONDS = 2 * 24 * 3600;
    uint32 internal constant FIVE_DAYS_IN_SECONDS = 5 * 24 * 3600;
    uint32 internal constant FOUR_MINS_IN_SECONDS = 4 * 60;
    uint32 internal constant TWO_MINS_IN_SECONDS = 2 * 60;
    uint32 internal constant ONE_MIN_IN_SECONDS = 60;
    uint32 internal constant TWO_WEEKS_IN_SECONDS = 2 * 7 * 24 * 3600;
    uint32 internal constant ONE_WEEK_IN_SECONDS = 7 * 24 * 3600;
    uint32 internal constant THIRTY_DAYS_IN_SECONDS = 30 * 24 * 3600;

    address public deployer;

    address private multicallAddress;

    // solhint-disable-next-line var-name-mixedcase
    address internal SNT_ADDRESS_OPTIMISM_MAINNET = 0x650AF3C15AF43dcB218406d30784416D64Cfb6B2;
    // solhint-disable-next-line var-name-mixedcase
    address internal SNT_ADDRESS_OPTIMISM_GOERLI = 0xcAD273fA2bb77875333439FDf4417D995159c3E1;
    // solhint-disable-next-line var-name-mixedcase
    address internal SNT_ADDRESS_OPTIMISM_SEPOLIA = 0x0B5DAd18B8791ddb24252B433ec4f21f9e6e5Ed0;

    // solhint-disable-next-line var-name-mixedcase
    address internal MULTICALL_ADDRESS_OPTIMISM = 0xeAa6877139d436Dc6d1f75F3aF15B74662617B2C;
    // solhint-disable-next-line var-name-mixedcase
    address internal MULTICALL_ADDRESS_OPTIMISM_GOERLI = 0xcA11bde05977b3631167028862bE2a173976CA11;
    // solhint-disable-next-line var-name-mixedcase
    address internal MULTICALL_ADDRESS_OPTIMISM_SEPOLIA = 0xcA11bde05977b3631167028862bE2a173976CA11;

    constructor(address _broadcaster) {
        deployer = _broadcaster;
        if (block.chainid == 31_337) {
            activeNetworkConfig = getOrCreateAnvilEthConfig();
        } else if (block.chainid == 10) {
            activeNetworkConfig = getOptimismMainnetConfig();
        } else if (block.chainid == 420) {
            activeNetworkConfig = getOptimismGoerliConfig();
        } else if (block.chainid == 11_155_420) {
            activeNetworkConfig = getOptimismSepoliaConfig();
        } else {
            revert("no network config for this chain");
        }
    }

    function getOptimismMainnetConfig() public returns (NetworkConfig memory) {
        // Actually, it'd be nicer to have `multicallAddress` be part of `NetworkConfig`,
        // however, adding another field to the struct causes us to run into the
        // "stack too deep" error during compilation, hence, we're using an additional
        // property on the contract to access the value later from there.
        multicallAddress = MULTICALL_ADDRESS_OPTIMISM;
        return NetworkConfig({
            votingLengthInSeconds: TWO_WEEKS_IN_SECONDS,
            votingVerificationLengthInSeconds: ONE_WEEK_IN_SECONDS,
            timeBetweenVotingInSeconds: THIRTY_DAYS_IN_SECONDS,
            featuredVotingLengthInSeconds: FIVE_DAYS_IN_SECONDS,
            featuredVotingVerificationLengthInSeconds: TWO_DAYS_IN_SECONDS,
            cooldownPeriod: 3,
            featuredPerVotingCount: 5,
            voteToken: SNT_ADDRESS_OPTIMISM_MAINNET
        });
    }

    function getOptimismGoerliConfig() public returns (NetworkConfig memory) {
        // Actually, it'd be nicer to have `multicallAddress` be part of `NetworkConfig`,
        // however, adding another field to the struct causes us to run into the
        // "stack too deep" error during compilation, hence, we're using an additional
        // property on the contract to access the value later from there.
        multicallAddress = MULTICALL_ADDRESS_OPTIMISM_GOERLI;
        return NetworkConfig({
            votingLengthInSeconds: FOUR_MINS_IN_SECONDS,
            votingVerificationLengthInSeconds: TWO_MINS_IN_SECONDS,
            timeBetweenVotingInSeconds: ONE_MIN_IN_SECONDS,
            featuredVotingLengthInSeconds: FOUR_MINS_IN_SECONDS,
            featuredVotingVerificationLengthInSeconds: TWO_MINS_IN_SECONDS,
            cooldownPeriod: 1,
            featuredPerVotingCount: 3,
            voteToken: SNT_ADDRESS_OPTIMISM_GOERLI
        });
    }

    function getOptimismSepoliaConfig() public returns (NetworkConfig memory) {
        // Actually, it'd be nicer to have `multicallAddress` be part of `NetworkConfig`,
        // however, adding another field to the struct causes us to run into the
        // "stack too deep" error during compilation, hence, we're using an additional
        // property on the contract to access the value later from there.
        multicallAddress = MULTICALL_ADDRESS_OPTIMISM_SEPOLIA;
        return NetworkConfig({
            votingLengthInSeconds: FOUR_MINS_IN_SECONDS,
            votingVerificationLengthInSeconds: TWO_MINS_IN_SECONDS,
            timeBetweenVotingInSeconds: ONE_MIN_IN_SECONDS,
            featuredVotingLengthInSeconds: FOUR_MINS_IN_SECONDS,
            featuredVotingVerificationLengthInSeconds: TWO_MINS_IN_SECONDS,
            cooldownPeriod: 1,
            featuredPerVotingCount: 3,
            voteToken: SNT_ADDRESS_OPTIMISM_SEPOLIA
        });
    }

    function getOrCreateAnvilEthConfig() public returns (NetworkConfig memory) {
        vm.startBroadcast(deployer);
        MiniMeTokenFactory minimeFactory = new MiniMeTokenFactory();
        MiniMeToken minimeToken = new MiniMeToken(
            minimeFactory,
            MiniMeToken(payable(address(0))),
            0,
            "Status Network Token",
            18,
            "STT",
            true
        );
        minimeToken.generateTokens(deployer, 100_000_000 ether);

        Multicall2 multicall = new Multicall2();
        vm.stopBroadcast();

        // Actually, it'd be nicer to have `multicallAddress` be part of `NetworkConfig`,
        // however, adding another field to the struct causes us to run into the
        // "stack too deep" error during compilation, hence, we're using an additional
        // property on the contract to access the value later from there.
        multicallAddress = address(multicall);

        return NetworkConfig({
            votingLengthInSeconds: FOUR_MINS_IN_SECONDS,
            votingVerificationLengthInSeconds: TWO_MINS_IN_SECONDS,
            timeBetweenVotingInSeconds: ONE_MIN_IN_SECONDS,
            featuredVotingLengthInSeconds: FOUR_MINS_IN_SECONDS,
            featuredVotingVerificationLengthInSeconds: TWO_MINS_IN_SECONDS,
            cooldownPeriod: 1,
            featuredPerVotingCount: 3,
            voteToken: address(minimeToken)
        });
    }

    function getMulticallAddress() public view returns (address) {
        if (multicallAddress == address(0)) {
            revert DeploymentConfig__InvalidMulticallAddress();
        }
        return multicallAddress;
    }
}
