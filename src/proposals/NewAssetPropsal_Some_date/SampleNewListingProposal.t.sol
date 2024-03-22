// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import {CommonTestBase} from './../../contracts/CommonTestBase.sol';

contract SampleNewListingProposal_Test is CommonTestBase {

    function setUp() public {
        vm.createSelectFork(vm.rpcUrl('mainnet'), 19161904);
    }

    function test_defaultProposalExecution() public {
    }
}
