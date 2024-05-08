// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

// import {GovV3Helpers, IPayloadsControllerCore, PayloadsControllerUtils} from 'aave-helpers/GovV3Helpers.sol';
import {EthereumScript} from 'src/contracts/ScriptUtils.sol';
import {AddAsset_Add_rETH_WETH_Mainnet_20240412} from './AddAsset_Add_rETH_WETH_Mainnet_20240412.sol';
import {VmSafe} from 'forge-std/Vm.sol';
import 'forge-std/Script.sol';
import {CommonTestBase} from 'src/contracts/CommonTestBase.sol';
import {IConfigurator} from 'src/contracts/IConfigurator.sol';
import {IGovernanceBravo} from 'src/contracts/IGovernanceBravo.sol';
import {IComp} from 'src/contracts/IComp.sol';
import {VmSafe} from 'forge-std/Vm.sol';
import 'forge-std/Test.sol';
import {IProposalGenerator} from 'src/contracts/proposals/IProposalGenerator.sol';
import 'src/contracts/structs.sol';
import {GovernanceV3MainnetAssets, GovernanceV3Mainnet} from '../../contracts/compoundAddresses/GovernanceV3Mainnet.sol';
import {GovernanceV3} from 'src/contracts/compoundAddresses/GovernanceV3.sol';
import {EthereumScript} from 'src/contracts/ScriptUtils.sol';

contract Add is EthereumScript {
  AddAsset_Add_rETH_WETH_Mainnet_20240412 internal proposal;
  IGovernanceBravo governor;
    IComp comp;

  string public lastRevertReason;
  // address constant PROPOSER = 0xeaa0ba6e410c6ba5c4a186544161cd4a7d0b12cd;
  address compAddress = 0xc00e94Cb662C3520282E6f5717214004A7f26888; // Replace with the Comp address

  event RevertReason(string reason);
  function setUp() public {
    // vm.createSelectFork(vm.rpcUrl('mainnet'));
    proposal = new AddAsset_Add_rETH_WETH_Mainnet_20240412();
    governor = IGovernanceBravo(GovernanceV3.GOVERNOR_BRAVO);
    comp = IComp(compAddress);

  }

  function run() public {
    Structs.ProposalInfo memory proposalInfo = proposal.createProposalPayload();
    vm.startBroadcast(msg.sender);
    // console.log("Block number: ", block.number);

    console.log("msg.sender: ", msg.sender);

     bool whitelisted = governor.isWhitelisted(msg.sender);
     console.log("isWhitelisted: ", whitelisted);

    // uint96 votes = comp.getCurrentVotes(PROPOSER);
    // console.log("Votes: ", votes);
    try
      governor.propose(
        proposalInfo.targets,
        proposalInfo.values,
        proposalInfo.signatures,
        proposalInfo.calldatas,
        'dawdawd'
      )
    {
      vm.stopBroadcast();

      console.log("Proposal created successfully");
    } catch Error(string memory reason) {
      lastRevertReason = reason;
      emit RevertReason(reason);
    } catch (bytes memory) {
      lastRevertReason = 'Unknown error occurred';
      emit RevertReason('Unknown error occurred');
    }
  }
}
