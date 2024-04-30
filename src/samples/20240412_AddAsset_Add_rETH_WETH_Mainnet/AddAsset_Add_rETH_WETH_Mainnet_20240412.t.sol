// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import {AddAsset_Add_rETH_WETH_Mainnet_20240412} from './AddAsset_Add_rETH_WETH_Mainnet_20240412.sol';
import {CommonTestBase} from 'src/contracts/CommonTestBase.sol';
import {IConfigurator} from 'src/contracts/IConfigurator.sol';
import {VmSafe} from 'forge-std/Vm.sol';
import 'forge-std/Test.sol';
import {IProposalGenerator} from 'src/contracts/proposals/IProposalGenerator.sol';
import 'src/contracts/structs.sol';
import {GovernanceV3MainnetAssets, GovernanceV3Mainnet} from '../../contracts/compoundAddresses/GovernanceV3Mainnet.sol';

/**
 * @dev Test for AddAsset_Add_rETH_Weth_Mainnet_20240412
 * command: make test-contract filter=AddAsset_Add_rETH_Weth_Mainnet_20240412
 */
contract AddAsset_Add_rETH_WETH_Mainnet_20240412_Test is CommonTestBase {
  AddAsset_Add_rETH_WETH_Mainnet_20240412 internal proposal;
  IConfigurator configurator;

  function setUp() public {
    vm.createSelectFork(vm.rpcUrl('mainnet'), 18544451);
    proposal = new AddAsset_Add_rETH_WETH_Mainnet_20240412();
  }

  function isAssetListed() internal returns (bool) {
    configurator = IConfigurator(GovernanceV3Mainnet.CONFIGURATOR_PROXY);
    try
      configurator.getAssetIndex(
        GovernanceV3Mainnet.WETH_COMET_PROXY,
        GovernanceV3MainnetAssets.RETH_TOKEN
      )
    returns (uint256 assetIndex) {
      return true;
    } catch (bytes memory lowLevelData) {
      emit log('Asset is not listed');
    }
    return false;
  }

  function getProposalForCurrentChain(
    Structs.ProposalInfo memory proposalInfo
  ) internal returns (Structs.ProposalInfo memory) {
    return proposalInfo;
  }

  function testAddAsset() public {
    require(!isAssetListed(), 'Asset should not be listed before execution.');
    vm.startPrank(GovernanceV3Mainnet.TIMELOCK);
    Structs.ProposalInfo memory proposalInfo = proposal.createProposalPayload();

    Structs.ProposalInfo memory proposalInfoForCurrentChain = getProposalForCurrentChain(
      proposalInfo
    );

    executeProposal(proposalInfoForCurrentChain);

    require(isAssetListed(), 'Asset should be listed after execution.');
    vm.stopPrank();
  }
}
