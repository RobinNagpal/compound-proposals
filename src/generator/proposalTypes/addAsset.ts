import {select} from '@inquirer/prompts';
import {numberPrompt} from '../prompts/numberPrompt';
import {percentPrompt} from '../prompts/percentPrompt';
import {AllMarkets, AssetConfig, CodeArtifact, FeatureModule, Market, MarketAndAssetConfig, Options, ProposalType, TokenMapping} from '../types';
import {SupportedBaseAsset, SupportedChain} from './../compoundMarkets';

async function fetchAssetConfig(chain: SupportedChain): Promise<AssetConfig> {
  const asset = await selectToken(chain);
  return {
    asset: `${asset}_TOKEN`,
    priceFeed: `${asset}_PRICE_FEED`,
    decimals: `${asset}_DECIMALS`,
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
    choices: chainChoices.map((c) => ({value: c, name: c})),
  });
}

async function selectBaseAsset(chain: SupportedChain): Promise<string> {
  const baseAssetChoices = AllMarkets.filter((market) => market.chain === chain).map((market) => market.baseAsset);
  return await select({
    message: 'What is the base asset for the market?',
    choices: baseAssetChoices.map((a) => ({value: a, name: a})),
  });
}

async function selectToken(chain: SupportedChain): Promise<string> {
  const tokenChoices = TokenMapping[chain];

  return await select({
    message: 'Select the token you want to add:',
    choices: tokenChoices.map((token) => ({value: token, name: token})),
  });
}

async function fetchMarketInfo(): Promise<Market> {
  const chain = await selectChain();
  const baseAsset = await selectBaseAsset(chain);
  const marketInfo: Market = {
    chain: chain,
    baseAsset: baseAsset as SupportedBaseAsset,
  };

  return marketInfo;
}

const getLibraryNamesForChain = (chain: SupportedChain): {Governance: string; Assets: string} => {
  switch (chain.toString()) {
    case SupportedChain.Mainnet:
      return {
        Governance: 'GovernanceV3Mainnet',
        Assets: 'GovernanceV3MainnetAssets',
      };

    case SupportedChain.Polygon:
      return {
        Governance: 'GovernanceV3Polygon',
        Assets: 'GovernanceV3PolygonAssets',
      };
    default:
      throw new Error('Unsupported chain');
  }
};
const getProposalForCurrentChainFunction = (chain: SupportedChain) => {
  switch (chain.toString()) {
    case SupportedChain.Mainnet:
      return `
        function getProposalForCurrentChain(
          Structs.ProposalInfo memory proposalInfo
        ) internal returns (Structs.ProposalInfo memory) {
          return proposalInfo;
        }
      `;
    case SupportedChain.Polygon:
      return `
        function getProposalForCurrentChain(
          Structs.ProposalInfo memory proposalInfo
        ) internal returns (Structs.ProposalInfo memory) {
          require(proposalInfo.targets.length == 1, 'Only one target is allowed for this proposal.');
          require(
            proposalInfo.targets[0] == address(GovernanceV3Polygon.BRIDGE_RECEIVER),
            'Invalid target'
          );
          require(
            keccak256(bytes(proposalInfo.signatures[0])) ==
              keccak256(bytes('sendMessageToChild(address,bytes)')),
            'Invalid signature'
          );
      
          (address target, bytes memory encodedProposal) = abi.decode(
            proposalInfo.calldatas[0],
            (address, bytes)
          );
      
          (
            address[] memory targets,
            uint256[] memory values,
            string[] memory signatures,
            bytes[] memory calldatas
          ) = abi.decode(encodedProposal, (address[], uint256[], string[], bytes[]));
      
          Structs.ProposalInfo memory newProposalInfo = Structs.ProposalInfo({
            targets: targets,
            values: values,
            signatures: signatures,
            calldatas: calldatas
          });
          return newProposalInfo;
        }
      `;
    default:
      throw new Error('Unsupported chain');
  }
};
export const addAsset: FeatureModule<MarketAndAssetConfig> = {
  value: ProposalType.AddAsset,
  description: 'Add asset',
  async cli({options}): Promise<MarketAndAssetConfig> {
    const marketInfo = await fetchMarketInfo();
    const asset = await fetchAssetConfig(marketInfo.chain);

    return {asset, market: marketInfo};
  },
  build({options, cfg}: {options: Options; cfg: MarketAndAssetConfig}) {
    const isMainnetProposal = cfg.market.chain === SupportedChain.Mainnet;
    const {asset, priceFeed, decimals, borrowCollateralFactor, liquidateCollateralFactor, liquidationFactor, supplyCap} = cfg.asset;
    const {chain, baseAsset} = cfg.market;
    console.log('cfg: ', cfg);

    const libraryNamesForChain = getLibraryNamesForChain(cfg.market.chain);

    // Use this API to get the latest block number currently being mined on the network.
    // https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp=1578638524&closest=before&apikey=YourApiKeyToken
    const response: CodeArtifact = {
      code: {
        fn: [
          `
          function getNewAssetsConfigs() public pure override returns (Structs.AssetConfig[] memory) {
            Structs.AssetConfig[] memory configs = new Structs.AssetConfig[](1);
        
            configs[0] = Structs.AssetConfig({
              asset: ${libraryNamesForChain.Assets}.${asset},
              priceFeed: ${libraryNamesForChain.Assets}.${priceFeed},
              decimals: ${libraryNamesForChain.Assets}.${decimals},
              borrowCollateralFactor: ${borrowCollateralFactor}0000000000000000,
              liquidateCollateralFactor: ${liquidateCollateralFactor}0000000000000000,
              liquidationFactor: ${liquidationFactor}0000000000000000,
              supplyCap: uint128(${supplyCap} * 10**${libraryNamesForChain.Assets}.${decimals})
            });
            return configs;
          }
          `,
        ],
      },
      test: {
        fn: [
          `
          function isAssetListed() internal returns (bool) {
            IConfigurator configurator = IConfigurator(${libraryNamesForChain.Governance}.CONFIGURATOR_PROXY);
            try
              configurator.getAssetIndex(
                ${libraryNamesForChain.Governance}.${baseAsset}_COMET_PROXY,
                ${libraryNamesForChain.Assets}.${asset}
              )
            returns (uint256 assetIndex) {
              return true;
            } catch (bytes memory lowLevelData) {
              emit log('Asset is not listed');
            }
            return false;
          }
          `,
          getProposalForCurrentChainFunction(cfg.market.chain),
          `
          function testAddAsset() public {
            require(!isAssetListed(), 'Asset should not be listed before execution.');
            vm.startPrank(${libraryNamesForChain.Governance}.TIMELOCK);
            Structs.ProposalInfo memory proposalInfo = proposal.createProposalPayload();
        
            Structs.ProposalInfo memory proposalInfoForCurrentChain = getProposalForCurrentChain(
              proposalInfo
            );
        
            executeProposal(proposalInfoForCurrentChain);
        
            require(isAssetListed(), 'Asset is not listed after execution.');
            vm.stopPrank();
          }

          `,
        ],
      },
    };
    return response;
  },
};
