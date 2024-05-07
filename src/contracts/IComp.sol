// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

interface IComp {
  function delegate(address delegatee) external;
  function transfer(address dst, uint256 rawAmount) external returns (bool success);
  function getCurrentVotes(address account) external returns (uint96);
  function getPriorVotes(address account, uint256 blocknumber) external returns (uint96);
}
