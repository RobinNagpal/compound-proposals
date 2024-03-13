import { AllMarkets, AssetConfig, BaseAssets, CodeArtifact, FEATURE, FeatureModule, Market, MarketInfo, SupportedChain, SupportedChains } from '../types';
import { select } from '@inquirer/prompts';
import { stringPrompt } from '../prompts/stringPrompt';
import { numberPrompt } from '../prompts/numberPrompt';
import { addressPrompt } from '../prompts/addressPrompt';
import { percentPrompt } from '../prompts/percentPrompt';

async function fetchAssetConfig(required?: boolean): Promise<AssetConfig> {
  return {
    asset: await stringPrompt({
      message: 'Enter the asset name:',
      required: true,
    }),
    priceFeed: await addressPrompt({
      message: 'Enter the price feed address:',
      required: true,
    }),
    decimals: await stringPrompt({
      message: 'Enter the decimals:',
      required: true,
    }),
    borrowCollateralFactor: await percentPrompt({
      message: 'Enter the borrow collateral factor:',
      required: true,
    }),
    liquidateCollateralFactor: await percentPrompt({
      message: 'Enter the liquidate collateral factor:',
      required: true,
    }),
    liquidationFactor: await percentPrompt({
      message: 'Enter the liquidation factor:',
      required: true,
    }),
    supplyCap: await numberPrompt({
      message: 'Enter the supply cap:',
      required: true,
    }),
  };
}

async function selectChain(): Promise<SupportedChain> {
  const chainChoices = AllMarkets.reduce<SupportedChain[]>((acc, market) => {
    if (!acc.includes(market.chain)) {
      acc.push(market.chain);
    }
    return acc;
  }, []);

  return await select({
    message: 'Which chain to add the asset to?',
    choices: chainChoices.map((c) => ({ value: c, name: c })),
  });
}

async function selectBaseAsset(chain: SupportedChain): Promise<string> {
  const baseAssetChoices = AllMarkets.filter((market) => market.chain === chain).map((market) => market.baseAsset);
  return await select({
    message: 'What is the base asset for the market?',
    choices: baseAssetChoices.map((a) => ({ value: a, name: a })),
  });
}

async function fetchMarketInfo(): Promise<Market> {
  const chain = await selectChain();
  const baseAsset = await selectBaseAsset(chain);
  const marketInfo: Market = {
    chain: chain,
    baseAsset: baseAsset,
  };

  return marketInfo;
}

export const addAsset: FeatureModule<AssetConfig> = {
  value: FEATURE.ADD_ASSET,
  description: 'Add asset',
  async cli({ options }) {
    const marketInfo = await fetchMarketInfo();
    const asset = await fetchAssetConfig();

    return asset;
  },
  build({ result }) {
    const { asset, priceFeed, decimals, borrowCollateralFactor, liquidateCollateralFactor, liquidationFactor, supplyCap } = result;

    const response: CodeArtifact = {
      code: {
        fn: [
          `function addAsset() public pure override returns (MarketInfo memory) {
            MarketInfo memory assetConfig;
            assetConfig.asset: "${asset}",
            assetConfig.priceFeed: "${priceFeed}",
            assetConfig.decimals: ${decimals},
            assetConfig.borrowCollateralFactor: ${borrowCollateralFactor},
            assetConfig.liquidateCollateralFactor: ${liquidateCollateralFactor},
            assetConfig.liquidationFactor: ${liquidationFactor},
            assetConfig.supplyCap: ${supplyCap}
            return assetConfig;
          }`,
        ],
      },
    };
    return response;
  },
};
