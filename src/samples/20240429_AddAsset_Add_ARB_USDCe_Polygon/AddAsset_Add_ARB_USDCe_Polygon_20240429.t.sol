// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import {AddAsset_Add_ARB_USDCe_Polygon_20240429} from './AddAsset_Add_ARB_USDCe_Polygon_20240429.sol';
import {CommonTestBase} from 'src/contracts/CommonTestBase.sol';
import {IConfigurator} from 'src/contracts/IConfigurator.sol';
import {VmSafe} from 'forge-std/Vm.sol';
import 'forge-std/console.sol';
import 'forge-std/Test.sol';
import {IProposalGenerator} from 'src/contracts/proposals/IProposalGenerator.sol';
import 'src/contracts/structs.sol';
import {GovernanceV3PolygonAssets, GovernanceV3Polygon} from 'src/contracts/compoundAddresses/GovernanceV3Polygon.sol';

/**
 * @dev Test for AddAsset_Add_ARB_USDCe_Polygon_20240429
 * command: make test-contract filter=AddAsset_Add_ARB_USDCe_Polygon_20240429
 */
contract AddAsset_Add_ARB_USDCe_Polygon_20240429_Test is CommonTestBase {
  AddAsset_Add_ARB_USDCe_Polygon_20240429 internal proposal;
  IConfigurator configurator;

  function setUp() public {
    vm.createSelectFork(vm.rpcUrl('polygon'), 56399500);
    proposal = new AddAsset_Add_ARB_USDCe_Polygon_20240429();
    configurator = IConfigurator(GovernanceV3Polygon.CONFIGURATOR_PROXY);
  }

  function isAssetListed() internal returns (bool) {
    try
      configurator.getAssetIndex(
        GovernanceV3Polygon.USDCE_COMET_PROXY,
        GovernanceV3PolygonAssets.LINK_TOKEN
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
    vm.startPrank(GovernanceV3Polygon.TIMELOCK);
    Structs.ProposalInfo memory proposalInfo = proposal.createProposalPayload();

    (address target, bytes memory encodedProposal) = abi.decode(
      proposalInfo.calldatas[0],
      (address, bytes)
    );

    (
      address[] memory targets,
      uint256[] memory values,
      string[] memory signatures,
      bytes[] memory calldatas
    ) = abi.decode(encodedProposal, (address[], uint256[], string[], bytes[]));

    Structs.ProposalInfo memory newProposalInfo = Structs.ProposalInfo({
      targets: targets,
      values: values,
      signatures: signatures,
      calldatas: calldatas
    });

    executeProposal(newProposalInfo);
    vm.stopPrank();
  }
}
