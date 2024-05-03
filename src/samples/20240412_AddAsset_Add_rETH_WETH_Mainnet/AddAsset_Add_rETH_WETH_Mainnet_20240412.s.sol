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
import {VmSafe} from 'forge-std/Vm.sol';
import 'forge-std/Test.sol';
import {IProposalGenerator} from 'src/contracts/proposals/IProposalGenerator.sol';
import 'src/contracts/structs.sol';
import {GovernanceV3MainnetAssets, GovernanceV3Mainnet} from '../../contracts/compoundAddresses/GovernanceV3Mainnet.sol';
import {GovernanceV3} from '../../contracts/compoundAddresses/GovernanceV3.sol';
import {EthereumScript} from 'src/contracts/ScriptUtils.sol';

/**
 * @dev Deploy Ethereum
 * deploy-command: make deploy-ledger contract=src/20240125_AaveV3Ethereum_AddPYUSDToAaveV3EthereumMarket/AddPYUSDToAaveV3EthereumMarket_20240125.s.sol:DeployEthereum chain=mainnet
 * verify-command: npx catapulta-verify -b broadcast/AddPYUSDToAaveV3EthereumMarket_20240125.s.sol/1/run-latest.json
 */
// contract DeployEthereum is EthereumScript {
//   function run() external broadcast {
//     // deploy payloads
//     address payload0 = GovV3Helpers.deployDeterministic(
//       type(AaveV3Ethereum_AddPYUSDToAaveV3EthereumMarket_20240125).creationCode
//     );

//     // compose action
//     IPayloadsControllerCore.ExecutionAction[]
//       memory actions = new IPayloadsControllerCore.ExecutionAction[](1);
//     actions[0] = GovV3Helpers.buildAction(payload0);

//     // register action at payloadsController
//     GovV3Helpers.createPayload(actions);
//   }
// }

/**
 * @dev Create Proposal
 * command: make deploy-ledger contract=src/20240125_AaveV3Ethereum_AddPYUSDToAaveV3EthereumMarket/AddPYUSDToAaveV3EthereumMarket_20240125.s.sol:CreateProposal chain=mainnet
 */
// contract CreateProposal is EthereumScript {
//   function run() external {
//     // create payloads
//     PayloadsControllerUtils.Payload[] memory payloads = new PayloadsControllerUtils.Payload[](1);

//     // compose actions for validation
//     IPayloadsControllerCore.ExecutionAction[]
//       memory actionsEthereum = new IPayloadsControllerCore.ExecutionAction[](1);
//     actionsEthereum[0] = GovV3Helpers.buildAction(
//       type(AaveV3Ethereum_AddPYUSDToAaveV3EthereumMarket_20240125).creationCode
//     );
//     payloads[0] = GovV3Helpers.buildMainnetPayload(vm, actionsEthereum);

//     // create proposal
//     vm.startBroadcast();
//     GovV3Helpers.createProposal(
//       vm,
//       payloads,
//       GovV3Helpers.ipfsHashFile(
//         vm,
//         'src/20240125_AaveV3Ethereum_AddPYUSDToAaveV3EthereumMarket/AddPYUSDToAaveV3EthereumMarket.md'
//       )
//     );
//   }
// }

contract Add is EthereumScript {
  AddAsset_Add_rETH_WETH_Mainnet_20240412 internal proposal;
  IGovernanceBravo governor;

  function setUp() public {
    proposal = new AddAsset_Add_rETH_WETH_Mainnet_20240412();
    governor = IGovernanceBravo(GovernanceV3.GOVERNOR_BRAVO);
  }

  function run() public {
    Structs.ProposalInfo memory proposalInfo = proposal.createProposalPayload();
    vm.startBroadcast();
    governor.propose(
      proposalInfo.targets,
      proposalInfo.values,
      proposalInfo.signatures,
      proposalInfo.calldatas,
      './AddAsset_Add_rETH_WETH_Mainnet_20240412.md'
    );

    vm.stopBroadcast();
  }

}
