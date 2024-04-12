// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;
import './structs.sol';

interface IConfigurator {
  function addAsset(address cometProxy, Structs.AssetConfig calldata assetConfig) external;

  function setGovernor(address cometProxy, address newGovernor) external;

  function getAssetIndex(address cometProxy, address asset) external returns (uint256);
}
