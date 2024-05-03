// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

interface IGovernanceBravo {
  function propose(
    address[] memory targets,
    uint[] memory values,
    string[] memory signatures,
    bytes[] memory calldatas,
    string memory description
  ) external returns (uint);
}
