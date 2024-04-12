// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;
import './structs.sol';

interface IComet {
  function getAssetInfoByAddress(address asset) external view returns (Structs.AssetInfo memory);

  function getAssetInfo(uint8 assetIndex) external view returns (Structs.AssetInfo memory);
}
