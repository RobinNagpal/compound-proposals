export const SupportedChains = [
  'Mainnet',
  'Polygon',
  'Arbitrum',
  'Base'
];

export const BaseAssets = [
  'USDC',
  'USDT',
  'WETH'
];

type SupportedChain = typeof SupportedChains[number];
type BaseAsset = typeof BaseAssets[number];

export  interface Market  {
  chain: SupportedChain;
  baseAsset: BaseAsset;
}
export interface Options {
  force?: boolean;
  market: Market;
  title: string;
  // automatically generated shortName from title
  shortName: string;
  author: string;
  discussion: string;
  snapshot: string;
  configFile?: string;
  date: string;
}

export interface AssetConfig {
  asset: string;
  priceFeed: string;
  decimals: number;
  borrowCollateralFactor: number;
  liquidateCollateralFactor: number;
  liquidationFactor: number;
  supplyCap: number;
}
export interface MarketInfo {
  governor: string,
  pauseGuardian: string,
  baseToken: BaseAsset,
  baseTokenPriceFeed: string,
  extensionDelegate: string,
  supplyKink: number,
  supplyPerYearInterestRateSlopeLow: number,
  supplyPerYearInterestRateSlopeHigh: number,
  supplyPerYearInterestRateBase: number,
  borrowKink: number,
  borrowPerYearInterestRateSlopeLow: number,
  borrowPerYearInterestRateSlopeHigh: number,
  borrowPerYearInterestRateBase: number,
  storeFrontPriceFactor: number,
  trackingIndexScale: number,
  baseTrackingSupplySpeed: number,
  baseTrackingBorrowSpeed: number,
  baseMinForRewards: number,
  baseBorrowMin: number,
  targetReserves: number,
  assetConfigs: AssetConfig[]
}

export const AllMarkets: Market[] = [
  {chain: 'Mainnet', baseAsset: 'USDC'},
  {chain: 'Mainnet', baseAsset: 'USDT'},
  {chain: 'Mainnet', baseAsset: 'WETH'},
  {chain: 'Polygon', baseAsset: 'USDC'},
]

export enum FEATURE {
  ADD_ASSET = 'ADD_ASSET',
  OTHERS = 'OTHERS',
}


export type CodeArtifact = {
  code?: {
    constants?: string[];
    fn?: string[];
    execute?: string[];
  };
  test?: {
    fn?: string[];
  };
  cip?: {
    specification: string[];
  };
};


export interface FeatureModule<T extends {} = {}> {
  description: string;
  value: FEATURE;
  cli: (args: { options: Options; market: SupportedChain; }) => Promise<T>;
  build: (args: { options: Options; market: SupportedChain; }) => CodeArtifact;
}
