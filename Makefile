# include .env file and export its env vars
# (-include to ignore error if it does not exist)
-include .env

PROPOSAL_PATH ?= src/proposals/20240514_AddAsset_At522Polygon/At522Polygon_BNB_Polygon_20240514.t.sol
SCRIPT_PATH ?= src/proposals/20240510_AddAsset_Asset/AddAsset_Asset_20240510.s.sol:Add
SUMMARY_PATH ?= src/proposals/20240510_AddAsset_Asset/Asset_20240510.md
SENDER ?= 0x2B384212EDc04Ae8bB41738D05BA20E33277bf33
RPC_URL?= https://ethereum-rpc.publicnode.com/

run_anvil:
	anvil --chain-id 1 --steps-tracing --fork-url ${RPC_URL}
run_test:
	forge test --match-path "$(PROPOSAL_PATH)" 
run_script:
	forge script ${SCRIPT_PATH} -vvvv --fork-url http://localhost:8545 --unlocked --sender ${SENDER} --broadcast
run_script_pk:
	forge script ${SCRIPT_PATH} -vvvv --fork-url http://localhost:8545 --sender ${SENDER} --private-key ${PRIVATE_KEY} --broadcast
run_script_ledger:
	forge script ${SCRIPT_PATH} -vvvv --fork-url http://localhost:8545  --ledger --mnemonics foo --mnemonic-indexes ${MNEMONIC_INDEX} --sender ${LEDGER_SENDER} --broadcast
generate-summary:
	yarn generate-summary ${SUMMARY_PATH}
