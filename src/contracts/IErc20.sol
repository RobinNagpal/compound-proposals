// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

interface IErc20 {
    function implementation() external view returns (address);
    function decimals() external view returns (uint);
    function underlying() external view returns (address);
}
