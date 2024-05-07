// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

interface IGovernanceBravo {
  function propose(
    address[] calldata targets,
    uint[] calldata values,
    string[] calldata signatures,
    bytes[] calldata calldatas,
    string calldata description
  ) external returns (uint);
  function _setWhitelistAccountExpiration(address account, uint expiration) external;
  function isWhitelisted(address account) external returns (bool);
}
