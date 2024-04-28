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

/**
 * @title Add_ARB
 * @author Robin Nagpal
 * - Discussion: TODO
 */
contract AddAsset_Add_ARB_20240412 is WethMainnetProposalGenerator {
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
