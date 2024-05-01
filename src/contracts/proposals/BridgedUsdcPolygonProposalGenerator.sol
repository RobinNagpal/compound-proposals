// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './../structs.sol';
import {ProposalGenerator} from './ProposalGenerator.sol';
import './MarketConfig.sol';
import {GovernanceV3Polygon} from '../compoundAddresses/GovernanceV3Polygon.sol';

abstract contract BridgedUsdcPolygonProposalGenerator is
  ProposalGenerator(
    MarketConfig({
      configuratorProxy: address(GovernanceV3Polygon.CONFIGURATOR_PROXY),
      cometProxy: address(GovernanceV3Polygon.USDCE_COMET_PROXY),
      cometProxyAdmin: address(GovernanceV3Polygon.USDCE_COMET_PROXY_ADMIN)
    })
  )
{
  function createProposalPayload() public view override returns (Structs.ProposalInfo memory) {
    Structs.ProposalInfo memory polygonProposalInfo = super.createProposalPayload();

    bytes memory message = abi.encode(
      polygonProposalInfo.targets,
      polygonProposalInfo.values,
      polygonProposalInfo.signatures,
      polygonProposalInfo.calldatas
    );

    Structs.ProposalInfo memory proposalInfo;

    proposalInfo.targets = new address[](1);
    proposalInfo.values = new uint256[](1);
    proposalInfo.signatures = new string[](1);
    proposalInfo.calldatas = new bytes[](1);

    proposalInfo.targets[0] = address(GovernanceV3Polygon.BRIDGE_RECEIVER);
    proposalInfo.values[0] = 0;
    proposalInfo.signatures[0] = 'sendMessageToChild(address,bytes)';
    proposalInfo.calldatas[0] = abi.encode(GovernanceV3Polygon.CONFIGURATOR_PROXY, message);

    return proposalInfo;
  }
}
