// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

interface ICometEngine {
  struct AssetConfig {
    address asset;
    address priceFeed;
    uint8 decimals;
    uint64 borrowCollateralFactor;
    uint64 liquidateCollateralFactor;
    uint64 liquidationFactor;
    uint128 supplyCap;
  }

  struct KinkUpdate {
    address asset;
    uint256 supplyKink;
    uint256 borrowKink;
  }
}
