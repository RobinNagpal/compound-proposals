// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0;

library GovernanceV3Polygon {
  address internal constant CONFIGURATOR_PROXY = 0x83E0F742cAcBE66349E3701B171eE2487a26e738;

  address internal constant USDCE_COMET_PROXY = 0xF25212E676D1F7F89Cd72fFEe66158f541246445;
  address internal constant USDCE_COMET_PROXY_ADMIN = 0xd712ACe4ca490D4F3E92992Ecf3DE12251b975F9;

  address internal constant BRIDGE_RECEIVER = 0x18281dfC4d00905DA1aaA6731414EABa843c468A;

  address internal constant TIMELOCK = 0xCC3E7c85Bb0EE4f09380e041fee95a0caeDD4a02;
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

  address internal constant LINK_TOKEN = 0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39;
  address internal constant LINK_PRICE_FEED = 0xd9FFdb71EbE7496cC440152d43986Aae0AB76665; // TODO: This needs to be fixed
  uint8 internal constant LINK_DECIMALS = 18;

  address internal constant BNB_TOKEN = 0x3BA4c387f786bFEE076A58914F5Bd38d668B42c3;
  address internal constant BNB_PRICE_FEED = 0x82a6c4AF830caa6c97bb504425f6A66165C2c26e;
  uint8 internal constant BNB_DECIMALS = 18;

  address internal constant SHIB_TOKEN = 0x6f8a06447Ff6FcF75d803135a7de15CE88C1d4ec;
  address internal constant SHIB_PRICE_FEED = 0x3710abeb1A0Fc7C2EC59C26c8DAA7a448ff6125A;
  uint8 internal constant SHIB_DECIMALS = 18;

  address internal constant AVAX_TOKEN = 0x2C89bbc92BD86F8075d1DEcc58C7F4E0107f286b;
  address internal constant AVAX_PRICE_FEED = 0xe01eA2fbd8D76ee323FbEd03eB9a8625EC981A10;
  uint8 internal constant AVAX_DECIMALS = 18;

  address internal constant UNI_TOKEN = 0xb33EaAd8d922B1083446DC23f610c2567fB5180f;
  address internal constant UNI_PRICE_FEED = 0xdf0Fb4e4F928d2dCB76f438575fDD8682386e13C;
  uint8 internal constant UNI_DECIMALS = 18;

  address internal constant AAVE_TOKEN = 0xD6DF932A45C0f255f85145f286eA0b292B21C90B;
  address internal constant AAVE_PRICE_FEED = 0x72484B12719E23115761D5DA1646945632979bB6;
  uint8 internal constant AAVE_DECIMALS = 18;
  
  address internal constant MATIC_TOKEN = 0x0000000000000000000000000000000000001010;
  address internal constant MATIC_PRICE_FEED = 0xAB594600376Ec9fD91F8e885dADF0CE036862dE0;
  uint8 internal constant MATIC_DECIMALS = 18;
}
