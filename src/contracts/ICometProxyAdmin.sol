// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;
import './structs.sol';

interface ICometProxyAdmin {
    function deployAndUpgradeTo(address configuratorProxy, address cometProxy) external;

    function owner() external view returns (address);
}
