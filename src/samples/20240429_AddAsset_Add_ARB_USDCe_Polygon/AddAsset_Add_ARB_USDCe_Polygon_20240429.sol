// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import {IConfigurator} from 'src/contracts/IConfigurator.sol';
import {ICometProxyAdmin} from 'src/contracts/ICometProxyAdmin.sol';
import {Structs} from 'src/contracts/structs.sol';
import {CommonTestBase} from 'src/contracts/CommonTestBase.sol';
import {VmSafe} from 'forge-std/Vm.sol';
import 'forge-std/console.sol';
import {BridgedUsdcPolygonProposalGenerator} from 'src/contracts/proposals/BridgedUsdcPolygonProposalGenerator.sol';
import 'src/contracts/proposals/MarketConfig.sol';
import {GovernanceV3PolygonAssets} from 'src/contracts/compoundAddresses/GovernanceV3Polygon.sol';

/**
 * @title Add_ARB
 * @author Robin Nagpal
 * - Discussion: TODO
 */
contract AddAsset_Add_ARB_USDCe_Polygon_20240429 is BridgedUsdcPolygonProposalGenerator {
  function getNewAssetsConfigs() public pure override returns (Structs.AssetConfig[] memory) {
    Structs.AssetConfig[] memory configs = new Structs.AssetConfig[](1);

    configs[0] = Structs.AssetConfig({
      asset: GovernanceV3PolygonAssets.LINK_TOKEN,
      priceFeed: GovernanceV3PolygonAssets.LINK_PRICE_FEED,
      decimals: GovernanceV3PolygonAssets.LINK_DECIMALS,
      borrowCollateralFactor: 900,
      liquidateCollateralFactor: 930000000000000000,
      liquidationFactor: 970000000000000000,
      supplyCap: 300000000000000000
    });
    return configs;
  }
}
