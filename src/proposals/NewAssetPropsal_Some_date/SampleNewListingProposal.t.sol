// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import {CommonTestBase} from './../../contracts/CommonTestBase.sol';
import 'forge-std/Test.sol';
import {SampleNewListingProposal} from './SampleNewListingProposal.sol';
import {IComptroller} from './../../contracts/IComptroller.sol';
import {IErc20} from './../../contracts/IErc20.sol';

contract SampleNewListingProposal_Test is CommonTestBase {
    SampleNewListingProposal internal proposal;
    address COMPTROLLER_ADDRESS = 0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B;
    address cTokenAddress = 0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643;

    function setUp() public {
        vm.createSelectFork(vm.rpcUrl('mainnet'), 19161904);
        proposal = new SampleNewListingProposal();
    }

    function test_isAssetListed() public {
        (bool isListed, , ) = IComptroller(COMPTROLLER_ADDRESS).markets(cTokenAddress);
        assertTrue(isListed, 'The asset is not listed');
    }

    function test_CollateralFactor() public {
        (, uint collateralFactorMantissa, ) = IComptroller(COMPTROLLER_ADDRESS).markets(cTokenAddress);
        uint expectedCollateralFactorMantissa = 0.8e18;
        assertEq(collateralFactorMantissa, expectedCollateralFactorMantissa, 'Collateral factor mismatch');
    }

    function test_Implementation() public {
        // address expectedImplementation = 0x3363BAe2Fc44dA742Df13CD3ee94b6bB868ea376;
        address expectedImplementation = 0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643;
        IErc20 cToken = IErc20(cTokenAddress);
        address actualImplementation = cToken.implementation();
        assertEq(actualImplementation, expectedImplementation, 'Implementation mismatch');
    }

    function test_Decimals() public {
        uint expectedDecimals = 18;
        IErc20 cToken = IErc20(cTokenAddress);
        // uint actualDecimals = cToken.decimals();
        address underlyingAdd = cToken.underlying();
        IErc20 underlying = IErc20(underlyingAdd);
        uint actualDecimals = underlying.decimals();
        assertEq(actualDecimals, expectedDecimals, 'Decimals mismatch');
    }
}
