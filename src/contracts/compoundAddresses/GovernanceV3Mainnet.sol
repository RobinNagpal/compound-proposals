// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0;

library GovernanceV3Mainnet {
  address internal constant CONFIGURATOR_PROXY = 0x316f9708bB98af7dA9c68C1C3b5e79039cD336E3;
}

library GovernanceV3MainnetAssets {
  address internal constant COMP_TOKEN = 0xc00e94Cb662C3520282E6f5717214004A7f26888;
  address internal constant COMP_PRICE_FEED = 0xdbd020CAeF83eFd542f4De03e3cF0C28A4428bd5;
  uint8 internal constant COMP_DECIMALS = 18;

  address internal constant WBTC_TOKEN = 0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599;
  address internal constant WBTC_PRICE_FEED = 0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c;
  uint8 internal constant WBTC_DECIMALS = 8;

  address internal constant WETH_TOKEN = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
  address internal constant WETH_PRICE_FEED = 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419;
  uint8 internal constant WETH_DECIMALS = 18;

  address internal constant UNI_TOKEN = 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984;
  address internal constant UNI_PRICE_FEED = 0x553303d460EE0afB37EdFf9bE42922D8FF63220e;
  uint8 internal constant UNI_DECIMALS = 18;

  address internal constant LINK_TOKEN = 0x514910771AF9Ca656af840dff83E8264EcF986CA;
  address internal constant LINK_PRICE_FEED = 0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c;
  uint8 internal constant LINK_DECIMALS = 18;
}