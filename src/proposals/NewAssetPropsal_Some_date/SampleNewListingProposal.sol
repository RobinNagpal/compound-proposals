// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import {CometProposalPayload} from './../../contracts/CometProposalPayload.sol';
import {ICometEngine} from './../../contracts/ICometEngine.sol';

contract SampleNewListingProposal is CometProposalPayload {
    function newAssets() public view override returns (ICometEngine.AssetConfig[] memory) {
        ICometEngine.AssetConfig[] memory configs = new ICometEngine.AssetConfig[](1);

        configs[0] = ICometEngine.AssetConfig({
            asset: 0x6B175474E89094C44Da98b954EedeAC495271d0F,
            priceFeed: 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e,
            decimals: 18,
            borrowCollateralFactor: 0.75e18,
            liquidateCollateralFactor: 0.8e18,
            liquidationFactor: 0.8e18,
            supplyCap: 2000
        });

        return configs;
    }
}
