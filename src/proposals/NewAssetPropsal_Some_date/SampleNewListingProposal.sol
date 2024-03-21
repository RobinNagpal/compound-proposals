// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import {CometProposalPayload} from './../../contracts/CometProposalPayload.sol'

contract SampleNewListingProposal is CometProposalPayload {
    function newAssets() public view override returns (ICometEngine.AssetConfig[] memory) {
        address public asset = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
        address public priceFeed = 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e;
        uint decimals = 18;
        uint borrowCollateralFactor = 0.75e18;
        uint liquidateCollateralFactor = 0.8e18;
        uint liquidationFactor = 0.8e18;
        uint supplyCap = 2000;

        return ICometEngine.AssetConfig[]({
            asset: asset,
            priceFeed: priceFeed,
            decimals: decimals,
            borrowCollateralFactor: borrowCollateralFactor,
            liquidateCollateralFactor: liquidateCollateralFactor,
            liquidationFactor: liquidationFactor,
            supplyCap: supplyCap
        });
    }
}


