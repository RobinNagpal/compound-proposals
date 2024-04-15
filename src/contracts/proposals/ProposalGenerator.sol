// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './../structs.sol';
import {IProposalGenerator} from "./IProposalGenerator.sol";
import "./GeneratorConfig.sol";

abstract contract ProposalGenerator is IProposalGenerator {

  GeneratorConfig public GENERATOR_CONFIG;

  constructor(GeneratorConfig memory generatorConfig) {
    GENERATOR_CONFIG = generatorConfig;
  }

  function createProposalPayload() public view returns (IProposalGenerator.ProposalInfo memory) {
    NewAssetConfig[] memory assets = getNewAssetsConfigs();

    InterestRateUpdate[] memory rateUpdates = getInterestRateUpdates();

    uint numActions = assets.length + rateUpdates.length;

    IProposalGenerator.ProposalInfo memory proposalInfo;

    proposalInfo.targets = new address[](numActions);
    proposalInfo.values = new uint256[](numActions);
    proposalInfo.signatures = new string[](numActions);
    proposalInfo.calldatas = new bytes[](numActions);

    uint i = 0;
    for (i = 0; i < assets.length; i++) {
      proposalInfo.targets[i] = GENERATOR_CONFIG.configuratorProxy;
      proposalInfo.values[i] = 0;
      proposalInfo.signatures[i] = 'configureAsset(address,address,uint8,uint64,uint64,uint64,uint128)';
      proposalInfo.calldatas[i] = abi.encode(assets[i].asset, assets[i].priceFeed, assets[i].decimals, assets[i].borrowCollateralFactor, assets[i].liquidateCollateralFactor, assets[i].liquidationFactor, assets[i].supplyCap);
    }


    for (uint j = 0; j < rateUpdates.length; j++) {
      proposalInfo.targets[i] = GENERATOR_CONFIG.configuratorProxy;
      proposalInfo.values[i] = 0;
      proposalInfo.signatures[i] = 'updateInterestRates(address,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64)';
      proposalInfo.calldatas[i] = abi.encode(rateUpdates[j].asset, rateUpdates[j].supplyPerYearInterestRateSlopeLow, rateUpdates[j].supplyPerYearInterestRateSlopeHigh, rateUpdates[j].supplyPerYearInterestRateBase, rateUpdates[j].borrowPerYearInterestRateSlopeLow, rateUpdates[j].borrowPerYearInterestRateSlopeHigh, rateUpdates[j].borrowPerYearInterestRateBase, rateUpdates[j].borrowKink, rateUpdates[j].supplyKink);
      i++;
    }

    return proposalInfo;
  }

  function getNewAssetsConfigs() pure public returns (NewAssetConfig[] memory) {
    return new NewAssetConfig[](0);
  }

  function getInterestRateUpdates() pure public returns (InterestRateUpdate[] memory) {
    return new InterestRateUpdate[](0);
  }
}
