run_anvil:
	anvil --chain-id 1 --steps-tracing
run_script:
	forge script src/samples/20240412_AddAsset_Add_rETH_WETH_Mainnet/AddAsset_Add_rETH_WETH_Mainnet_20240412.s.sol:Add -vvv --fork-url https://ethereum-rpc.publicnode.com/ --unlocked --sender 0x2B384212EDc04Ae8bB41738D05BA20E33277bf33 --broadcast
