// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import {AddAsset_Add_rETH_WETH_Mainnet_20240412} from './AddAsset_Add_rETH_WETH_Mainnet_20240412.sol';
import {AddAsset_Add_rETH_WETH_Mainnet_20240412_Summary} from './AddAsset_Add_rETH_WETH_Mainnet_20240412_Summary.sol';
import {VmSafe} from 'forge-std/Vm.sol';
import 'forge-std/Script.sol';
import 'forge-std/console.sol';
import {IGovernanceBravo} from 'src/contracts/IGovernanceBravo.sol';
import {Structs} from 'src/contracts/structs.sol';
import {GovernanceV3} from 'src/contracts/compoundAddresses/GovernanceV3.sol';
import {EthereumScript} from 'src/contracts/ScriptUtils.sol';

contract Add is EthereumScript {
  AddAsset_Add_rETH_WETH_Mainnet_20240412 internal proposal;
  AddAsset_Add_rETH_WETH_Mainnet_20240412_Summary internal description;
  IGovernanceBravo governor;

  function setUp() public {
    proposal = new AddAsset_Add_rETH_WETH_Mainnet_20240412();
    description = new AddAsset_Add_rETH_WETH_Mainnet_20240412_Summary();
    governor = IGovernanceBravo(GovernanceV3.GOVERNOR_BRAVO);
  }

  function run() public {
    Structs.ProposalInfo memory proposalInfo = proposal.createProposalPayload();
    string memory summary = description.getSummary();
    vm.startBroadcast(msg.sender);

    try
      governor.propose(
        proposalInfo.targets,
        proposalInfo.values,
        proposalInfo.signatures,
        proposalInfo.calldatas,
        summary
      )
    {
      vm.stopBroadcast();

      console.log('Proposal created successfully');
    } catch Error(string memory reason) {
      console.log('Error: ', reason);
    } catch (bytes memory) {
      console.log('Error: Unknown reason');
    }
  }
}
