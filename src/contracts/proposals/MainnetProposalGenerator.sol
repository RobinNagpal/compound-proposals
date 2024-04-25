// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ProposalGenerator} from "./ProposalGenerator.sol";

abstract contract MainnetProposalGenerator is ProposalGenerator {
  constructor(GeneratorConfig memory generatorConfig) ProposalGenerator(generatorConfig) {}
}
