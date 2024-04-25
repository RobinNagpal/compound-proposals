// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ProposalGenerator} from '../ProposalGenerator.sol';
import {GovernanceV3Mainnet} from '../../compoundAddresses/GovernanceV3Mainnet.sol';
import {GeneratorConfig} from '../GeneratorConfig.sol';
import '../../../contracts/structs.sol';

contract AddAssetMainnetProposal is ProposalGenerator {
  constructor()
    ProposalGenerator(
      GeneratorConfig({
        configuratorProxy: GovernanceV3Mainnet.CONFIGURATOR_PROXY,
        cometProxy: address(0),
        cometProxyAdmin: address(0)
      })
    )
  {}

  function getNewAssetsConfigs() public pure override returns (Structs.AssetConfig[] memory) {
    Structs.AssetConfig[] memory configs = new Structs.AssetConfig[](1);
    configs[0] = Structs.AssetConfig({
      asset: 0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1,
      priceFeed: 0xb2A824043730FE05F3DA2efaFa1CBbe83fa548D6,
      decimals: 18,
      borrowCollateralFactor: 65,
      liquidateCollateralFactor: 70,
      liquidationFactor: 80,
      supplyCap: 500000
    });
    return configs;
  }
}
