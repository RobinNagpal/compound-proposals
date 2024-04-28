// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ProposalGenerator} from './ProposalGenerator.sol';
import './MarketConfig.sol';

abstract contract UsdcMainnetProposalGenerator is ProposalGenerator {
  constructor(MarketConfig memory marketConfig) ProposalGenerator(marketConfig) {}
}
