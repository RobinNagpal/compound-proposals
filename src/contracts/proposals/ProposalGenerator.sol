// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './../structs.sol';
import {IProposalGenerator} from "./IProposalGenerator.sol";

abstract contract ProposalGenerator is IProposalGenerator {

  function createProposalPayload() public pure virtual returns (ProposalInfo memory) {
    IProposalEngine.NewAssetConfig[] memory assets = newAssets();

    ProposalInfo memory proposalInfo;
    proposalInfo.targets = new address[](1);
    proposalInfo.values = new uint256[](1);
    proposalInfo.signatures = new string[](1);
    proposalInfo.calldatas = new bytes[](1);

    proposalInfo.targets[0] = address(0x1234567890123456789012345678901234567890);
    proposalInfo.values[0] = 0;
    proposalInfo.signatures[0] = 'functionName(uint256)';
    proposalInfo.calldatas[0] = abi.encode(123);

    return proposalInfo;
  }

  function newAssets() public view virtual returns (IProposalEngine.NewAssetConfig[] memory) {
    return new IProposalEngine.NewAssetConfig[]();
  }

  function interestRateUpdates() external view returns (IProposalEngine.InterestRateUpdate[] memory) {
    return new IProposalEngine.InterestRateUpdate[]();
  }
}
