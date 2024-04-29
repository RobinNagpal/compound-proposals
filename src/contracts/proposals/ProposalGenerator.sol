// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './../structs.sol';
import {IProposalGenerator} from './IProposalGenerator.sol';
import './MarketConfig.sol';

abstract contract ProposalGenerator is IProposalGenerator {
  MarketConfig public MARKET_CONFIG;

  constructor(MarketConfig memory marketConfig) {
    MARKET_CONFIG = marketConfig;
  }

  function createProposalPayload() public view returns (Structs.ProposalInfo memory) {
    Structs.AssetConfig[] memory addAssets = getNewAssetsConfigs();

    Structs.InterestRateUpdate[] memory rateUpdates = getInterestRateUpdates();

    uint numActions = addAssets.length + rateUpdates.length + 1;

    Structs.ProposalInfo memory proposalInfo;

    proposalInfo.targets = new address[](numActions);
    proposalInfo.values = new uint256[](numActions);
    proposalInfo.signatures = new string[](numActions);
    proposalInfo.calldatas = new bytes[](numActions);

    uint i = 0;
    for (i = 0; i < addAssets.length; i++) {
      proposalInfo.targets[i] = MARKET_CONFIG.configuratorProxy;
      proposalInfo.values[i] = 0;
      proposalInfo.signatures[
        i
      ] = 'addAsset(address,(address,address,uint8,uint64,uint64,uint64,uint128))';
      proposalInfo.calldatas[i] = abi.encode(MARKET_CONFIG.cometProxy, addAssets[i]);
    }

    for (uint j = 0; j < rateUpdates.length; j++) {
      proposalInfo.targets[i] = MARKET_CONFIG.configuratorProxy;
      proposalInfo.values[i] = 0;
      proposalInfo.signatures[
        i
      ] = 'updateInterestRates(address,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64)';
      proposalInfo.calldatas[i] = abi.encode(
        MARKET_CONFIG.cometProxy,
        rateUpdates[j].supplyPerYearInterestRateSlopeLow,
        rateUpdates[j].supplyPerYearInterestRateSlopeHigh,
        rateUpdates[j].supplyPerYearInterestRateBase,
        rateUpdates[j].borrowPerYearInterestRateSlopeLow,
        rateUpdates[j].borrowPerYearInterestRateSlopeHigh,
        rateUpdates[j].borrowPerYearInterestRateBase,
        rateUpdates[j].borrowKink,
        rateUpdates[j].supplyKink
      );
      i++;
    }

    proposalInfo.targets[i] = MARKET_CONFIG.cometProxyAdmin;
    proposalInfo.signatures[i] = 'deployAndUpgradeTo(address,address)';
    proposalInfo.values[i] = 0;
    proposalInfo.calldatas[i] = abi.encode(
      MARKET_CONFIG.configuratorProxy,
      MARKET_CONFIG.cometProxy
    );

    return proposalInfo;
  }

  function getNewAssetsConfigs()
    public
    pure
    virtual
    override
    returns (Structs.AssetConfig[] memory)
  {
    return new Structs.AssetConfig[](0);
  }

  function getInterestRateUpdates()
    public
    pure
    virtual
    override
    returns (Structs.InterestRateUpdate[] memory)
  {
    return new Structs.InterestRateUpdate[](0);
  }
}
