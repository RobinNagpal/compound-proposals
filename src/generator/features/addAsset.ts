import { AllMarkets, CodeArtifact, FEATURE, FeatureModule, Market, MarketInfo } from '../types';


function fetchMarketInfo(market: Market): MarketInfo {
  return null as any as MarketInfo
}
export const addAsset: FeatureModule<MarketInfo> = {
  value: FEATURE.ADD_ASSET,
  description: 'addListings (adding a new asset)',
  async cli({options:{market}}) {
    const response = AllMarkets.find((m) => m.chain === market.chain && m.baseAsset === market.baseAsset);
    return fetchMarketInfo(response! as Market);
  },
  build({options}) {
    const response: CodeArtifact = {
      code: {
        constants: [],
        execute: [],
        fn: [],
      },
      test: {
        fn: [],
      },
      cip: {
        specification: [],
      },
    };
    return response;
  },
};

