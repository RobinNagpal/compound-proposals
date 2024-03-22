// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

interface IComptroller {
    function markets(address cToken) external view returns (bool isListed, uint collateralFactorMantissa, bool isComped);
}
