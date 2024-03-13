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

async function fetchMarketInfo<T extends boolean>(required?: T): Promise<MarketInfo> {
  const chain = await selectChain();

  // Prompt the user to select a base asset based on the selected chain
  const baseAsset = await selectBaseAsset(chain);

  const marketInfo: MarketInfo = {
    governor: await addressPrompt({
      message: 'Governor Address: ',
      required: true,
    }),
    pauseGuardian: await addressPrompt({
      message: 'Pause guardian address: ',
      required: true,
    }),
    baseToken: await addressPrompt({
      message: 'Base token address: ',
      required: true,
    }),
    baseTokenPriceFeed: await addressPrompt({
      message: 'Base token price feed address: ',
      required: true,
    }),
    extensionDelegate: await addressPrompt({
      message: 'Extension delegate address: ',
      required: true,
    }),
    supplyKink: await percentPrompt({
      message: 'Supply kink: ',
      required: true,
    }),
    supplyPerYearInterestRateSlopeLow: await stringPrompt({
      message: 'What is the supply per year interest rate slope low?',
      required: true,
    }),
    supplyPerYearInterestRateSlopeHigh: await stringPrompt({
      message: 'What is the supply per year interest rate slope high?',
      required: true,
    }),
    supplyPerYearInterestRateBase: await stringPrompt({
      message: 'What is the supply per year interest rate base?',
      required: true,
    }),
    borrowKink: await percentPrompt({
      message: 'Borrow kink: ',
      required: true,
    }),
    borrowPerYearInterestRateSlopeLow: await stringPrompt({
      message: 'What is the borrow per year interest rate slope low?',
      required: true,
    }),
    borrowPerYearInterestRateSlopeHigh: await stringPrompt({
      message: 'What is the borrow per year interest rate slope high?',
      required: true,
    }),
    borrowPerYearInterestRateBase: await stringPrompt({
      message: 'What is the borrow per year interest rate base?',
      required: true,
    }),
    storeFrontPriceFactor: await percentPrompt({
      message: 'Store front price factor: ',
      required: true,
    }),
    trackingIndexScale: await stringPrompt({
      message: 'Tracking index scale?',
      required: true,
    }),
    baseTrackingSupplySpeed: await stringPrompt({
      message: 'What is the base tracking supply speed?',
      required: true,
    }),
    baseTrackingBorrowSpeed: await stringPrompt({
      message: 'What is the base tracking borrow speed?',
      required: true,
    }),
    baseMinForRewards: await stringPrompt({
      message: 'What is the base min for rewards?',
      required: true,
    }),
    baseBorrowMin: await stringPrompt({
      message: 'What is the base borrow min?',
      required: true,
    }),
    targetReserves: await stringPrompt({
      message: 'What is the target reserves?',
      required: true,
    }),
    assetConfigs: [],
  };

  const numAssets = await numberPrompt({
    message: 'Enter the number of assets to configure:',
    required: true,
  });

  for (let i = 0; i < parseInt(numAssets); i++) {
    console.log(`Enter configuration for asset # ${i + 1}`);
    marketInfo.assetConfigs.push(await fetchAssetConfig());
  }

  return marketInfo;
}

export const addAsset: FeatureModule<MarketInfo> = {
  value: FEATURE.ADD_ASSET,
  description: 'Add asset',
  async cli({ options }) {
    const marketInfo = await fetchMarketInfo();

    return marketInfo;
  },
  build({ result }) {
    const {
      governor,
      pauseGuardian,
      baseToken,
      baseTokenPriceFeed,
      extensionDelegate,
      supplyKink,
      supplyPerYearInterestRateSlopeLow,
      supplyPerYearInterestRateSlopeHigh,
      supplyPerYearInterestRateBase,
      borrowKink,
      borrowPerYearInterestRateSlopeLow,
      borrowPerYearInterestRateSlopeHigh,
      borrowPerYearInterestRateBase,
      storeFrontPriceFactor,
      trackingIndexScale,
      baseTrackingSupplySpeed,
      baseTrackingBorrowSpeed,
      baseMinForRewards,
      baseBorrowMin,
      targetReserves,
      assetConfigs,
    } = result;

    const assetConfigCode = assetConfigs
      .map((config, index) => {
        return `assets[${index}] = AssetConfig({
          asset: "${config.asset}",
          priceFeed: "${config.priceFeed}",
          decimals: ${config.decimals},
          borrowCollateralFactor: ${config.borrowCollateralFactor},
          liquidateCollateralFactor: ${config.liquidateCollateralFactor},
          liquidationFactor: ${config.liquidationFactor},
          supplyCap: ${config.supplyCap}
        });`;
      })
      .join('\n');

    const response: CodeArtifact = {
      code: {
        fn: [
          `function addMarketInfo() public pure override returns (MarketInfo memory) {
            MarketInfo memory marketInfo;
            marketInfo.governor = "${governor}";
            marketInfo.pauseGuardian = "${pauseGuardian}";
            marketInfo.baseToken = "${baseToken}";
            marketInfo.baseTokenPriceFeed = "${baseTokenPriceFeed}";
            marketInfo.extensionDelegate = "${extensionDelegate}";
            marketInfo.supplyKink = ${supplyKink};
            marketInfo.supplyPerYearInterestRateSlopeLow = "${supplyPerYearInterestRateSlopeLow}";
            marketInfo.supplyPerYearInterestRateSlopeHigh = "${supplyPerYearInterestRateSlopeHigh}";
            marketInfo.supplyPerYearInterestRateBase = "${supplyPerYearInterestRateBase}";
            marketInfo.borrowKink = ${borrowKink};
            marketInfo.borrowPerYearInterestRateSlopeLow = "${borrowPerYearInterestRateSlopeLow}";
            marketInfo.borrowPerYearInterestRateSlopeHigh = "${borrowPerYearInterestRateSlopeHigh}";
            marketInfo.borrowPerYearInterestRateBase = "${borrowPerYearInterestRateBase}";
            marketInfo.storeFrontPriceFactor = ${storeFrontPriceFactor};
            marketInfo.trackingIndexScale = "${trackingIndexScale}";
            marketInfo.baseTrackingSupplySpeed = "${baseTrackingSupplySpeed}";
            marketInfo.baseTrackingBorrowSpeed = "${baseTrackingBorrowSpeed}";
            marketInfo.baseMinForRewards = "${baseMinForRewards}";
            marketInfo.baseBorrowMin = "${baseBorrowMin}";
            marketInfo.targetReserves = "${targetReserves}";
            // Initialize array
            AssetConfig[] memory assets = new AssetConfig[](${assetConfigs.length});
            ${assetConfigCode}
            marketInfo.assetConfigs = assets;
            return marketInfo;
          }`,
        ],
      },
    };
    return response;
  },
};
