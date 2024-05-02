export const MAINNET_KNOWN_ASSETS = ['WETH', 'USDC', 'COMP', 'LINK', 'UNI', 'WBTC', 'RETH'];
export const POLYGON_KNOWN_ASSETS = ['WETH', 'WBTC', 'WMATIC', 'LINK'];

export type MainnetAsset = (typeof MAINNET_KNOWN_ASSETS)[number];
export type PolygonAsset = (typeof POLYGON_KNOWN_ASSETS)[number];

export enum SupportedChain {
  Mainnet = 'Mainnet',
  Polygon = 'Polygon',
  Arbitrum = 'Arbitrum',
  Base = 'Base',
  Optimism = 'Optimism',
}

export enum SupportedBaseAsset {
  WETH = 'WETH',
  BRIDGED_USDC = 'BRIDGED_USDC',
  NATIVE_USDC = 'NATIVE_USDC',
}
