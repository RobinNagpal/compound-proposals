// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import {ICometEngine} from './ICometEngine.sol';

abstract contract CometProposalPayload {
    /// @dev to be overridden on the child if any extra logic is needed pre-listing
    function _preExecute() internal virtual {}

    /// @dev to be overridden on the child if any extra logic is needed post-listing
    function _postExecute() internal virtual {}

    function execute() external {
        _preExecute();

        ICometEngine.AssetConfig[] memory listings = newAssets();
        ICometEngine.KinkUpdate[] memory caps = kinkUpdates();

        // if (listings.length != 0) {
        //   address(CONFIG_ENGINE).functionDelegateCall(
        //     abi.encodeWithSelector(CONFIG_ENGINE.listAssets.selector, getPoolContext(), listings)
        //   );
        // }

        // if (caps.length != 0) {
        //   address(CONFIG_ENGINE).functionDelegateCall(
        //     abi.encodeWithSelector(CONFIG_ENGINE.updateCaps.selector, caps)
        //   );
        // }

        _postExecute();
    }

    /// @dev to be defined in the child with a list of new assets to list
    function newAssets() public view virtual returns (ICometEngine.AssetConfig[] memory) {
        return new ICometEngine.AssetConfig[](0);
    }

    /// @dev to be defined in the child with a list of caps to update
    function kinkUpdates() public view virtual returns (ICometEngine.KinkUpdate[] memory) {
        return new ICometEngine.KinkUpdate[](0);
    }
}
