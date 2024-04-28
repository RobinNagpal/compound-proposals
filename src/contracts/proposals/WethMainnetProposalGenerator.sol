// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ProposalGenerator} from './ProposalGenerator.sol';
import './MarketConfig.sol';
import {GovernanceV3Mainnet} from '../compoundAddresses/GovernanceV3Mainnet.sol';

abstract contract WethMainnetProposalGenerator is
  ProposalGenerator(
    MarketConfig({
      configuratorProxy: address(GovernanceV3Mainnet.CONFIGURATOR_PROXY),
      cometProxy: address(GovernanceV3Mainnet.WETH_COMET_PROXY),
      cometProxyAdmin: address(GovernanceV3Mainnet.WETH_COMET_PROXY_ADMIN)
    })
  )
{}
