// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0;


library GovernanceV3Polygon {
    address internal constant CONFIGURATOR_PROXY = 0x84E93EC6170ED630f5ebD89A1AAE72d4F63f2713;
}

library GovernanceV3PolygonAssets {
    address internal constant WETH_TOKEN = 0x7ceb23fd6bc0add59e62ac25578270cff1b9f619;
    address internal constant WETH_PRICE_FEED = 0xF9680D99D6C9589e2a93a78A04A279e509205945;
    uint8 internal constant WETH_DECIMALS = 18;

    address internal constant WBTC_TOKEN = 0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6;
    address internal constant WBTC_PRICE_FEED = 0xDE31F8bFBD8c84b5360CFACCa3539B938dd78ae6;
    uint8 internal constant WBTC_DECIMALS = 8;

    address internal constant WMATIC_TOKEN = 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270;
    address internal constant WMATIC_PRICE_FEED = 0xAB594600376Ec9fD91F8e885dADF0CE036862dE0;
    uint8 internal constant WMATIC_DECIMALS = 18;

}

