// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct MarketConfig {
  address configuratorProxy;
  address cometProxyAdmin;
  address cometProxy; // cWETHv3, cUSDCv3, cUSDTv3
}

struct L2MarketConfig {
  address configuratorProxy;
  address cometProxyAdmin;
  address cometProxy; // cWETHv3, cUSDCv3, cUSDTv3
  address bridgeReceiver;
}
