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

export enum ProposalType {
  AddAsset = 'AddAsset',
  Others = 'Others',
}

export type FeatureConfigs = Partial<Record<ProposalType, FeatureConfig>>;

export type FeatureCache = {blockNumber: number};

export interface FeatureConfig {
  artifacts: CodeArtifact[];
  configs: {[key: string]: any};
}

export interface Market {
  chain: SupportedChain;
  baseAsset: SupportedBaseAsset;
}

export const TokenMapping = {
  [SupportedChain.Mainnet]: ['WETH', 'USDC', 'COMP', 'LINK', 'UNI', 'WBTC', 'RETH'],
  [SupportedChain.Polygon]: ['LINK', 'WETH', 'WBTC', 'WMATIC'],
  [SupportedChain.Arbitrum]: [],
  [SupportedChain.Base]: [],
  [SupportedChain.Optimism]: [],
};

export interface Options {
  force?: boolean;
  market: Market;
  title: string;
  features: ProposalType[];
  // automatically generated shortName from title
  shortName: string;
  author: string;
  discussion: string;
  date: string;
}

export interface AssetConfig {
  asset: string;
  priceFeed: string;
  decimals: string;
  borrowCollateralFactor: string;
  liquidateCollateralFactor: string;
  liquidationFactor: string;
  supplyCap: string;
}

export interface MarketAndAssetConfig {
  market: Market;
  asset: AssetConfig;
}

export interface MarketInfo {
  governor: string;
  pauseGuardian: string;
  baseToken: SupportedBaseAsset;
  baseTokenPriceFeed: string;
  extensionDelegate: string;
  supplyKink: string;
  supplyPerYearInterestRateSlopeLow: string;
  supplyPerYearInterestRateSlopeHigh: string;
  supplyPerYearInterestRateBase: string;
  borrowKink: string;
  borrowPerYearInterestRateSlopeLow: string;
  borrowPerYearInterestRateSlopeHigh: string;
  borrowPerYearInterestRateBase: string;
  storeFrontPriceFactor: string;
  trackingIndexScale: string;
  baseTrackingSupplySpeed: string;
  baseTrackingBorrowSpeed: string;
  baseMinForRewards: string;
  baseBorrowMin: string;
  targetReserves: string;
  assetConfigs: AssetConfig[];
}

export const AllMarkets: Market[] = [
  {chain: SupportedChain.Mainnet, baseAsset: SupportedBaseAsset.NATIVE_USDC},
  {chain: SupportedChain.Mainnet, baseAsset: SupportedBaseAsset.WETH},
  {chain: SupportedChain.Polygon, baseAsset: SupportedBaseAsset.BRIDGED_USDC},
];

export type ConfigFile = {
  rootOptions: Options;
  featureOptions: Record<string, FeatureConfig>;
};

export type CodeArtifact = {
  code?: {
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
  value: ProposalType;
  cli: (args: {options: Options}) => Promise<T>;
  build: (args: {options: Options; cfg: T}) => CodeArtifact;
}
