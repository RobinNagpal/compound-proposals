// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import 'forge-std/StdJson.sol';
import 'forge-std/Test.sol';
import {VmSafe} from 'forge-std/Vm.sol';
import {IProposalGenerator} from './proposals/IProposalGenerator.sol';
import './structs.sol';

contract CommonTestBase is Test {
  event TransactionExecuted(bool success, address target, string signature, string returnData);

  function executeProposal(Structs.ProposalInfo memory proposalInfo, Vm vm) public {
    require(
      proposalInfo.targets.length == proposalInfo.calldatas.length &&
        proposalInfo.calldatas.length == proposalInfo.signatures.length,
      'Array lengths must match'
    );
    for (uint i = 0; i < proposalInfo.targets.length; i++) {
      bytes memory callData;

      if (bytes(proposalInfo.signatures[i]).length == 0) {
        callData = proposalInfo.calldatas[i];
      } else {
        callData = abi.encodePacked(
          bytes4(keccak256(bytes(proposalInfo.signatures[i]))),
          proposalInfo.calldatas[i]
        );
      }
      vm.startPrank(address(0x6d903f6003cca6255D85CcA4D3B5E5146dC33925));
      (bool success, bytes memory returnData) = proposalInfo.targets[i].call{
        value: proposalInfo.values[i]
      }(callData);
      // emit TransactionExecuted(success, proposalInfo.targets[i],proposalInfo.signatures[i], _getRevertMsg(returnData));
      if (returnData.length > 0) {
        // Attempt to extract a revert reason from the returned data
        emit TransactionExecuted(
          success,
          proposalInfo.targets[i],
          proposalInfo.signatures[i],
          _getRevertMsg(returnData)
        );
      } else {
        // Log the failure without a specific reason
        emit TransactionExecuted(
          success,
          proposalInfo.targets[i],
          proposalInfo.signatures[i],
          'Failed without a reason'
        );
      }
      require(success, 'Timelock::executeTransaction: Transaction execution reverted.');
      vm.stopPrank();
    }
  }

  function _getRevertMsg(bytes memory _returnData) private pure returns (string memory) {
    if (_returnData.length < 68) return 'Transaction reverted silently';

    assembly {
      // Strip the signature hash (first 4 bytes) and get the string location, which starts at 32 bytes offset
      _returnData := add(_returnData, 0x04)
    }
    return abi.decode(_returnData, (string)); // All that remains is the revert string
  }
}
