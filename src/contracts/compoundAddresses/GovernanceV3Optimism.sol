// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0;

library GovernanceV3Optimism {
  address internal constant CONFIGURATOR_PROXY = 0x84E93EC6170ED630f5ebD89A1AAE72d4F63f2713;
}

library GovernanceV3OptimismAssets {
  address internal constant OP_TOKEN = 0x4200000000000000000000000000000000000042;
  address internal constant OP_PRICE_FEED = 0x0D276FC14719f9292D5C1eA2198673d1f4269246;
  uint8 internal constant OP_DECIMALS = 18;

  address internal constant WETH_TOKEN = 0x4200000000000000000000000000000000000006;
  address internal constant WETH_PRICE_FEED = 0x13e3Ee699D1909E989722E753853AE30b17e08c5;
  uint8 internal constant WETH_DECIMALS = 18;

  address internal constant WBTC_TOKEN = 0x68f180fcCe6836688e9084f035309E29Bf0A2095;
  address internal constant WBTC_PRICE_FEED = 0x718A5788b89454aAE3A028AE9c111A29Be6c2a6F;
  uint8 internal constant WBTC_DECIMALS = 8;
}
