// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0;

library GovernanceV3Polygon {
  address internal constant CONFIGURATOR_PROXY = 0x83E0F742cAcBE66349E3701B171eE2487a26e738;

  address internal constant USDCE_COMET_PROXY = 0xF25212E676D1F7F89Cd72fFEe66158f541246445;
  address internal constant USDCE_COMET_PROXY_ADMIN = 0xd712ACe4ca490D4F3E92992Ecf3DE12251b975F9;
}

library GovernanceV3PolygonAssets {
  address internal constant WETH_TOKEN = 0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619;
  address internal constant WETH_PRICE_FEED = 0xF9680D99D6C9589e2a93a78A04A279e509205945;
  uint8 internal constant WETH_DECIMALS = 18;

  address internal constant WBTC_TOKEN = 0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6;
  address internal constant WBTC_PRICE_FEED = 0xDE31F8bFBD8c84b5360CFACCa3539B938dd78ae6;
  uint8 internal constant WBTC_DECIMALS = 8;

  address internal constant WMATIC_TOKEN = 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270;
  address internal constant WMATIC_PRICE_FEED = 0xAB594600376Ec9fD91F8e885dADF0CE036862dE0;
  uint8 internal constant WMATIC_DECIMALS = 18;
}
