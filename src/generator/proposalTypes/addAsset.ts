import {select} from '@inquirer/prompts';
import {addressPrompt} from '../prompts/addressPrompt';
import {numberPrompt} from '../prompts/numberPrompt';
import {percentPrompt} from '../prompts/percentPrompt';
import {stringPrompt} from '../prompts/stringPrompt';
import {
  AllMarkets,
  AssetConfig,
  CodeArtifact,
  FeatureModule,
  Market,
  MarketAndAssetConfig,
  Options,
  ProposalType,
  SupportedBaseAsset,
  SupportedChain,
} from '../types';
import {Addresses} from '../utils/constants';

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
    const asset = await fetchAssetConfig();

    return {asset, market: marketInfo};
  },
  build({options, cfg}: {options: Options; cfg: MarketAndAssetConfig}) {
    const isMainnetProposal = cfg.market.chain === SupportedChain.Mainnet;
    const {asset, priceFeed, decimals, borrowCollateralFactor, liquidateCollateralFactor, liquidationFactor, supplyCap} = cfg.asset;
    console.log('cfg: ', cfg);

    const libraryNamesForChain = getLibraryNamesForChain(cfg.market.chain);

    // Use this API to get the latest block number currently being mined on the network.
    // https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp=1578638524&closest=before&apikey=YourApiKeyToken
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
            try
              configurator.getAssetIndex(
                ${libraryNamesForChain.Governance}.USDCE_COMET_PROXY,
                ${libraryNamesForChain.Assets}.LINK_TOKEN
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
        
            require(isAssetListed(), 'Asset should be listed after execution.');
            vm.stopPrank();
          }

          `,
        ],
      },
    };
    return response;
  },
};
