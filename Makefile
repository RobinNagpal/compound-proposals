run_anvil:
	anvil --chain-id 1 --steps-tracing --fork-url https://ethereum-rpc.publicnode.com/
run_test:
	forge test --match-path "src/proposals/20240510_AddAsset_Asset/AddAsset_Asset_20240510.t.sol" 
run_script:
	forge script src/proposals/20240510_AddAsset_Asset/AddAsset_Asset_20240510.s.sol:Add -vvvv --fork-url http://localhost:8545 --unlocked --sender 0x2B384212EDc04Ae8bB41738D05BA20E33277bf33 --broadcast
generate-summary:
	yarn generate-summary src/proposals/20240510_AddAsset_Asset/Asset_20240510.md
