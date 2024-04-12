import {
  AllMarkets,
  AssetConfig,
  BaseAssets,
  CodeArtifact,
  ProposalType,
  FeatureModule,
  Market,
  MarketInfo,
  SupportedChain,
  SupportedChains,
  MarketAndAssetConfig,
} from '../types';
import { select } from '@inquirer/prompts';
import { stringPrompt } from '../prompts/stringPrompt';
import { numberPrompt } from '../prompts/numberPrompt';
import { addressPrompt } from '../prompts/addressPrompt';
import { percentPrompt } from '../prompts/percentPrompt';
import { Addresses } from '../utils/constants';

async function fetchAssetConfig(required?: boolean): Promise<AssetConfig> {
  return {
    asset: await addressPrompt({
      message: 'Enter the asset address:',
      required: true,
      defaultValue: '0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1',
    }),
    priceFeed: await addressPrompt({
      message: 'Enter the price feed address:',
      required: true,
      defaultValue: '0xb2A824043730FE05F3DA2efaFa1CBbe83fa548D6',
    }),
    decimals: await stringPrompt({
      message: 'Enter the decimals:',
      required: true,
      defaultValue: '18',
    }),
    borrowCollateralFactor: await percentPrompt({
      message: 'Enter the borrow collateral factor:',
      required: true,
      defaultValue: '65',
    }),
    liquidateCollateralFactor: await percentPrompt({
      message: 'Enter the liquidate collateral factor:',
      required: true,
      defaultValue: '70',
    }),
    liquidationFactor: await percentPrompt({
      message: 'Enter the liquidation factor:',
      required: true,
      defaultValue: '80',
    }),
    supplyCap: await numberPrompt({
      message: 'Enter the supply cap:',
      required: true,
      defaultValue: '500000',
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

export const addAsset: FeatureModule<MarketAndAssetConfig> = {
  value: ProposalType.AddAsset,
  description: 'Add asset',
  async cli({ options }): Promise<MarketAndAssetConfig> {
    const marketInfo = await fetchMarketInfo();
    const asset = await fetchAssetConfig();

    return { asset, market: marketInfo };
  },
  build({ options, cfg }) {
    const { asset, priceFeed, decimals, borrowCollateralFactor, liquidateCollateralFactor, liquidationFactor, supplyCap } = cfg.asset;
    console.log('cfg: ', cfg);
    const response: CodeArtifact = {
      code: {
        fn: [
          `function executeAddAsset() external {
            IConfigurator configurator = IConfigurator(${Addresses.configuratorAddress}); 
            ICometProxyAdmin cometProxyAdmin = ICometProxyAdmin(${Addresses.cometProxyAdminAddress}); 

            Structs.AssetConfig memory assetConfig = Structs.AssetConfig({
                asset: ${asset},
                priceFeed: ${priceFeed},
                decimals: ${decimals},
                borrowCollateralFactor: ${borrowCollateralFactor},
                liquidateCollateralFactor: ${liquidateCollateralFactor},
                liquidationFactor: ${liquidationFactor},
                supplyCap: ${supplyCap}
            });
            
            configurator.addAsset(${Addresses.cometProxyAddress}, assetConfig);
            
            cometProxyAdmin.deployAndUpgradeTo(${Addresses.configuratorAddress}, ${Addresses.cometProxyAddress});
          }`,
        ],
      },
      test: {
        fn: [
          `
          function isAssetListed() internal returns (bool) {
            IConfigurator configurator = IConfigurator(address(${Addresses.configuratorAddress})); 
            try configurator.getAssetIndex(address(${Addresses.cometProxyAddress}), address(${asset})) returns (uint256 assetIndex) {
                return true;
            } catch (bytes memory lowLevelData) {
                emit log('Asset is not listed');
            }
            return false;
          }`,

          `function testAddAsset() public {
      
              require(!isAssetListed(), 'Asset should not be listed before execution.');
      
              vm.startPrank(address(${Addresses.governorAddress}));
              try proposal.executeAddAsset() {
                  require(isAssetListed(), 'Asset should be listed after execution.');
                  emit log('AddAsset executed successfully, and asset is now listed.');
              } catch {
                  emit log('AddAsset execution failed.');
              }
          }`,
        ],
      },
    };
    return response;
  },
};
