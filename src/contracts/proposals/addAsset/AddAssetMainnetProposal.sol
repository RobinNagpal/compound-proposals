// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ProposalGenerator} from '../ProposalGenerator.sol';
import {GovernanceV3Mainnet} from '../../compoundAddresses/GovernanceV3Mainnet.sol';
import {GeneratorConfig} from '../MarketConfig.sol';
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
      asset: address(0xae78736Cd615f374D3085123A210448E74Fc6393),
      priceFeed: address(0xA3A7fB5963D1d69B95EEC4957f77678EF073Ba08),
      decimals: 18,
      borrowCollateralFactor: 900,
      liquidateCollateralFactor: 930000000000000000,
      liquidationFactor: 970000000000000000,
      supplyCap: 300000000000000000
    });
    return configs;
  }
}
