// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './../structs.sol';

interface IProposalGenerator {
  function getNewAssetsConfigs() external returns (Structs.AssetConfig[] memory);

  function getInterestRateUpdates() external returns (Structs.InterestRateUpdate[] memory);
}
