// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import {IConfigurator} from 'src/contracts/IConfigurator.sol';
import {ICometProxyAdmin} from 'src/contracts/ICometProxyAdmin.sol';
import {Structs} from 'src/contracts/structs.sol';
import {CommonTestBase} from 'src/contracts/CommonTestBase.sol';
import {VmSafe} from 'forge-std/Vm.sol';
import 'forge-std/console.sol';
import {MainnetProposalGenerator} from '../../contracts/proposals/MainnetProposalGenerator.sol';
import '../../contracts/proposals/GeneratorConfig.sol';

/**
 * @title Add_ARB
 * @author Robin Nagpal
 * - Discussion: TODO
 */
contract AddAsset_Add_ARB_20240412 is
  MainnetProposalGenerator(
    GeneratorConfig({
      configuratorProxy: address(0x316f9708bB98af7dA9c68C1C3b5e79039cD336E3),
      cometProxyAdmin: address(0x1EC63B5883C3481134FD50D5DAebc83Ecd2E8779),
      cometProxy: address(0xA17581A9E3356d9A858b789D68B4d866e593aE94)
    })
  )
{
  function getNewAssetsConfigs() public pure override returns (Structs.AssetConfig[] memory) {
    Structs.AssetConfig[] memory configs = new Structs.AssetConfig[](1);

    configs[0] = Structs.AssetConfig({
       asset: address(0xae78736Cd615f374D3085123A210448E74Fc6393),
      priceFeed: address(0xA3A7fB5963D1d69B95EEC4957f77678EF073Ba08),
      decimals: 18,
      borrowCollateralFactor: 900000000000000000,
      liquidateCollateralFactor: 930000000000000000,
      liquidationFactor: 970000000000000000,
      supplyCap: 300000000000000000
    });
    return configs;
  }
}
