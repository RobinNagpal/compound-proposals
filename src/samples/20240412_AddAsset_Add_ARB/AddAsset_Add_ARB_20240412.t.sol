// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import {AddAsset_Add_ARB_20240412} from './AddAsset_Add_ARB_20240412.sol';
import {CommonTestBase} from 'src/contracts/CommonTestBase.sol';
import {IConfigurator} from 'src/contracts/IConfigurator.sol';
import {VmSafe} from 'forge-std/Vm.sol';
import 'forge-std/console.sol';
import 'forge-std/Test.sol';
import {IProposalGenerator} from '../../contracts/proposals/IProposalGenerator.sol';
import '../../contracts/structs.sol';

/**
 * @dev Test for AddAsset_Add_ARB_20240412
 * command: make test-contract filter=AddAsset_Add_ARB_20240412
 */
contract AddAsset_Add_ARB_20240412_Test is CommonTestBase {
  AddAsset_Add_ARB_20240412 internal proposal;

  function setUp() public {
    vm.createSelectFork(vm.rpcUrl('mainnet'), 18544451);
    proposal = new AddAsset_Add_ARB_20240412();
  }

  function isAssetListed() internal returns (bool) {
    IConfigurator configurator = IConfigurator(address(0x316f9708bB98af7dA9c68C1C3b5e79039cD336E3));
    try
      configurator.getAssetIndex(
        address(0xA17581A9E3356d9A858b789D68B4d866e593aE94),
        address(0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1)
      )
    returns (uint256 assetIndex) {
      return true;
    } catch (bytes memory lowLevelData) {
      emit log('Asset is not listed');
    }
    return false;
  }

  function testAddAsset() public {
    require(!isAssetListed(), 'Asset should not be listed before execution.');

    vm.startPrank(address(0x6d903f6003cca6255D85CcA4D3B5E5146dC33925));
    Structs.ProposalInfo memory proposalInfo = proposal.createProposalPayload();
    executeProposal(proposalInfo, vm);
    vm.stopPrank();
  }
}
