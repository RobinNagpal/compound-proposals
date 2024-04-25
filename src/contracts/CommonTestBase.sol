// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import 'forge-std/StdJson.sol';
import 'forge-std/Test.sol';
import {VmSafe} from 'forge-std/Vm.sol';
import "./proposals/IProposalGenerator.sol";

contract CommonTestBase is Test {

  function executeProposal(ProposalInfo memory proposalInfo) external {
    for (uint i = 0; i < proposalInfo.targets.length; i++) {
      bytes memory callData;

      if (bytes(signature).length == 0) {
        callData = data;
      } else {
        callData = abi.encodePacked(bytes4(keccak256(bytes(signature))), data);
      }

      (bool success, bytes memory returnData) = target.call{value: value}(callData);
      require(success, "Timelock::executeTransaction: Transaction execution reverted.");
    }
  }
}
