// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import {AddAsset_Add_ARB_20240412} from './AddAsset_Add_ARB_20240412.sol';
import {CommonTestBase} from 'src/contracts/CommonTestBase.sol';
import {IConfigurator} from 'src/contracts/IConfigurator.sol';
import {VmSafe} from 'forge-std/Vm.sol';
import 'forge-std/console.sol';
import 'forge-std/Test.sol';
import {IProposalGenerator} from 'src/contracts/proposals/IProposalGenerator.sol';
import 'src/contracts/structs.sol';

/**
 * @dev Test for AddAsset_Add_ARB_20240412
 * command: make test-contract filter=AddAsset_Add_ARB_20240412
 */
contract AddAsset_Add_ARB_20240412_Test is CommonTestBase {
  AddAsset_Add_ARB_20240412 internal proposal;
  IConfigurator configurator;

  function setUp() public {
    vm.createSelectFork(vm.rpcUrl('mainnet'), 18544451); // This will be polygon fork
    proposal = new AddAsset_Add_ARB_20240412();
    configurator = IConfigurator(address(0x316f9708bB98af7dA9c68C1C3b5e79039cD336E3));
  }

  function isAssetListed() internal returns (bool) {
    try
      configurator.getAssetIndex(
        address(0xA17581A9E3356d9A858b789D68B4d866e593aE94),
        address(0xae78736Cd615f374D3085123A210448E74Fc6393)
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

    // Additional part we need to do

    // get the calldata and decode it which will have (address, bytes)
    // decode it again to form Structs.ProposalInfo for polygon proposal

    executeProposal(proposalInfo);
    vm.stopPrank();
  }
}
