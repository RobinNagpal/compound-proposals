export const SupportedChains = ['Mainnet', 'Polygon', 'Arbitrum', 'Base'];

export const BaseAssets = ['USDC', 'WETH'];

export type SupportedChain = (typeof SupportedChains)[number];
export type BaseAsset = (typeof BaseAssets)[number];

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
  baseAsset: BaseAsset;
}
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
  baseToken: BaseAsset;
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
  {chain: 'Mainnet', baseAsset: 'USDC'},
  {chain: 'Mainnet', baseAsset: 'WETH'},
  {chain: 'Polygon', baseAsset: 'USDC'},
];

export type ConfigFile = {
  rootOptions: Options;
  featureOptions: Record<string, FeatureConfig>;
};

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
  value: ProposalType;
  cli: (args: {options: Options}) => Promise<T>;
  build: (args: {options: Options; cfg: T}) => CodeArtifact;
}
