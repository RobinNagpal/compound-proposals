// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import {IConfigurator} from 'src/contracts/IConfigurator.sol';
import {ICometProxyAdmin} from 'src/contracts/ICometProxyAdmin.sol';
import {Structs} from 'src/contracts/structs.sol';
import {CommonTestBase} from 'src/contracts/CommonTestBase.sol';
import {VmSafe} from 'forge-std/Vm.sol';
import 'forge-std/console.sol';
import {WethMainnetProposalGenerator} from '../../contracts/proposals/WethMainnetProposalGenerator.sol';
import '../../contracts/proposals/MarketConfig.sol';
import {GovernanceV3MainnetAssets} from '../../contracts/compoundAddresses/GovernanceV3Mainnet.sol';

/**
 * @title Add_ARB
 * @author Robin Nagpal
 * - Discussion: TODO
 */
contract AddAsset_Add_rETH_WETH_Mainnet_20240412 is WethMainnetProposalGenerator {
  function getNewAssetsConfigs() public pure override returns (Structs.AssetConfig[] memory) {
    Structs.AssetConfig[] memory configs = new Structs.AssetConfig[](1);

    configs[0] = Structs.AssetConfig({
      asset: GovernanceV3MainnetAssets.RETH_TOKEN,
      priceFeed: GovernanceV3MainnetAssets.RETH_PRICE_FEED,
      decimals: GovernanceV3MainnetAssets.RETH_DECIMALS,
      borrowCollateralFactor: 900,
      liquidateCollateralFactor: 930000000000000000,
      liquidationFactor: 970000000000000000,
      supplyCap: 300000000000000000
    });
    return configs;
  }
}
