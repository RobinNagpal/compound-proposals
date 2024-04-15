// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './../structs.sol';

interface IProposalGenerator {
  struct NewAssetConfig {
    address asset;
    address priceFeed;
    uint8 decimals;
    uint64 borrowCollateralFactor;
    uint64 liquidateCollateralFactor;
    uint64 liquidationFactor;
    uint128 supplyCap;
  }

  struct InterestRateUpdate {
    address asset;
    uint64 supplyPerYearInterestRateSlopeLow;
    uint64 supplyPerYearInterestRateSlopeHigh;
    uint64 supplyPerYearInterestRateBase;
    uint64 borrowPerYearInterestRateSlopeLow;
    uint64 borrowPerYearInterestRateSlopeHigh;
    uint64 borrowPerYearInterestRateBase;
    uint64 borrowKink;
    uint64 supplyKink;
  }

  function newAssets() external view returns (NewAssetConfig[] memory);

  function interestRateUpdates() external view returns (InterestRateUpdate[] memory);
}
