// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import {CommonTestBase} from './../../contracts/CommonTestBase.sol';
import {SampleNewListingProposal} from './SampleNewListingProposal.sol';
import {IConfigurator} from './../../contracts/IConfigurator.sol';
import {IComet} from './../../contracts/IComet.sol';
import {ICometProxyAdmin} from './../../contracts/ICometProxyAdmin.sol';
import {Structs} from './../../contracts/structs.sol';
import {IErc20} from './../../contracts/IErc20.sol';
import 'forge-std/StdJson.sol';
import 'forge-std/Test.sol';
import {VmSafe} from 'forge-std/Vm.sol';
import 'forge-std/console.sol';

contract SampleNewListingProposal_Test is CommonTestBase {
    event print_statement(string str);
    SampleNewListingProposal internal proposal;

    address constant configuratorAddress = 0x316f9708bB98af7dA9c68C1C3b5e79039cD336E3;
    address governorAddress = 0x6d903f6003cca6255D85CcA4D3B5E5146dC33925;
    address cometProxyAddress = 0xA17581A9E3356d9A858b789D68B4d866e593aE94;
    address cometProxyAdminAddress = 0x1EC63B5883C3481134FD50D5DAebc83Ecd2E8779;
    address asset = 0xae78736Cd615f374D3085123A210448E74Fc6393;
    address owner;

    IConfigurator configurator = IConfigurator(configuratorAddress);
    IComet comet = IComet(cometProxyAddress);
    ICometProxyAdmin cometProxyAdmin = ICometProxyAdmin(cometProxyAdminAddress);

    function setUp() public {
        // Fork mainnet at a specific block
        vm.createSelectFork(vm.rpcUrl('mainnet'), 18544451);
    }

    function printExistingAssets() public {
        uint8 assetIndex = 0;
        while (true) {
            try comet.getAssetInfo(assetIndex) returns (Structs.AssetInfo memory assetInfo) {
                emit log_named_address('Asset Address', assetInfo.asset);
                assetIndex++;
            } catch {
                // Once the call reverts, break out of the loop
                break;
            }
        }
    }

    function testPrintExistingAssets() public {
        // printExistingAssets(); // This will print all existing assets before proceeding with further tests
    }

    function executeAddAssetProposal() public {
        vm.prank(governorAddress);

        Structs.AssetConfig memory assetConfig = Structs.AssetConfig({
            asset: 0xae78736Cd615f374D3085123A210448E74Fc6393,
            priceFeed: 0xA3A7fB5963D1d69B95EEC4957f77678EF073Ba08,
            decimals: 18,
            borrowCollateralFactor: 900000000000000000,
            liquidateCollateralFactor: 930000000000000000,
            liquidationFactor: 975000000000000000,
            supplyCap: 30000000000000000000000
        });

        try configurator.addAsset(cometProxyAddress, assetConfig) {
            emit log('AddAsset executed successfully');
        } catch (bytes memory lowLevelData) {
            emit log('AddAsset execution failed with low-level data: ');
            emit log_bytes(lowLevelData); // This will print the revert reason if available
        }

        try cometProxyAdmin.owner() returns (address ownerAddress) {
            emit log_named_address('CometProxyAdmin Owner', ownerAddress);
            owner = ownerAddress;
        } catch (bytes memory lowLevelData) {
            emit log('CometProxyAdmin owner call failed with low-level data: ');
            emit log_bytes(lowLevelData); // This will print the revert reason if available
        }

        vm.prank(governorAddress);
        try cometProxyAdmin.deployAndUpgradeTo(configuratorAddress, cometProxyAddress) {
            emit log('DeployAndUpgradeTo executed successfully');
        } catch (bytes memory lowLevelData) {
            emit log('DeployAndUpgradeTo execution failed with low-level data: ');
            emit log_bytes(lowLevelData); // This will print the revert reason if available
        }
    }

    // function testAddAssetProposal() public {
    //     //     console.log('Executing AddAsset Proposal');
    //     //     emit log('Dawood is here');
    //     // uint256 preExecutionSnapshot = vm.snapshot();
    //     // Pre-execution verification
    //     // bool preExecutionListed = isAssetListet();
    //     // assertFalse(preExecutionListed, 'Asset is already listed before execution');
    //     // Execute the proposal
    //     executeAddAssetProposal();
    //     // vm.revertTo(preExecutionSnapshot);
    //     // Post-execution verification
    // bool postExecutionListed = isAssetListed();
    // assertTrue(postExecutionListed, 'Asset is not listed after execution');
    // }

    function testAddAndVerifyNewAsset() public {
        uint256 preExecutionSnapshot = vm.snapshot();
        // Pre-execution snapshot of assets
        address[] memory preExecutionAssets = getExistingAssets();
        for (uint i = 0; i < preExecutionAssets.length; i++) {
            emit log_named_address('pre Asset Address', preExecutionAssets[i]);
        }
        uint preExecutionAssetCount = preExecutionAssets.length;
        console.log('Pre ExecutionAssetCount: %d', preExecutionAssetCount);

        // Execute the proposal to add a new asset
        executeAddAssetProposal();

        // Post-execution snapshot of assets
        address[] memory postExecutionAssets = getExistingAssets();
        for (uint i = 0; i < postExecutionAssets.length; i++) {
            emit log_named_address('post Asset Address', postExecutionAssets[i]);
        }
        uint postExecutionAssetCount = postExecutionAssets.length;
        console.log('Post ExecutionAssetCount: %d', postExecutionAssetCount);

        console.log(isAssetListed() ? 'Asset is listed' : 'Asset is not listed');

        // Verify that a new asset has been added
        // require(postExecutionAssetCount == preExecutionAssetCount + 1, 'Asset not added');

        // Optionally, verify the address of the new asset if known
        // address expectedNewAssetAddress = 0xae78736Cd615f374D3085123A210448E74Fc6393; // example address
        // bool isNewAssetAdded = false;
        // for (uint i = 0; i < postExecutionAssets.length; i++) {
        //     if (postExecutionAssets[i] == expectedNewAssetAddress) {
        //         isNewAssetAdded = true;
        //         break;
        //     }
        // }
        // require(isNewAssetAdded, 'New asset address not found in post-execution snapshot');

        vm.revertTo(preExecutionSnapshot);
    }

    function getExistingAssets() internal returns (address[] memory) {
        uint8 assetIndex = 0;
        address[] memory assets = new address[](256); // assuming there won't be more than 256 assets for demonstration purposes
        uint assetCount = 0;

        while (true) {
            try comet.getAssetInfo(assetIndex) returns (Structs.AssetInfo memory assetInfo) {
                assets[assetIndex] = assetInfo.asset;
                assetIndex++;
                assetCount++;
            } catch {
                break;
            }
        }

        // Resize the assets array to fit the actual number of assets
        address[] memory resizedAssets = new address[](assetCount);
        for (uint i = 0; i < assetCount; i++) {
            resizedAssets[i] = assets[i];
        }

        return resizedAssets;
    }

    function isAssetListed() internal returns (bool) {
        try configurator.getAssetIndex(cometProxyAddress, asset) returns (uint256 assetIndex) {
            return true;
        } catch (bytes memory lowLevelData) {
            emit log('Check isAssetListed execution failed with low-level data: ');
            emit log_bytes(lowLevelData); // This will print the revert reason if available
        }
        return false;
    }
}
