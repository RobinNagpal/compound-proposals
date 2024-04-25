// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import {IConfigurator} from 'src/contracts/IConfigurator.sol';
import {ICometProxyAdmin} from 'src/contracts/ICometProxyAdmin.sol';
import {Structs} from 'src/contracts/structs.sol';
import {CommonTestBase} from 'src/contracts/CommonTestBase.sol';
import {VmSafe} from 'forge-std/Vm.sol';
import 'forge-std/console.sol';
import {MainnetProposalGenerator} from "../../contracts/proposals/MainnetProposalGenerator.sol";
/**
 * @title Add_ARB
 * @author Robin Nagpal
 * - Discussion: TODO
 */
contract AddAsset_Add_ARB_20240412 is MainnetProposalGenerator(GeneratorConfig({
  configuratorProxy: address(0x316f9708bB98af7dA9c68C1C3b5e79039cD336E3),
  cometProxyAdmin: address(0x1EC63B5883C3481134FD50D5DAebc83Ecd2E8779),
  cometProxy: address(0xA17581A9E3356d9A858b789D68B4d866e593aE94)
})) {

  function getNewAssetsConfigs() public view override returns (Structs.AssetConfig[] memory) {
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
