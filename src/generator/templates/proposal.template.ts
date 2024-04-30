import {generateContractName} from '../common';
import {FeatureConfig, Options, ProposalType} from '../types';
import {prefixWithPragma} from '../utils/constants';
import {prefixWithImports} from '../utils/importsResolver';

export const proposalTemplate = (options: Options, featureConfig: FeatureConfig, proposalType: ProposalType) => {
  const {title, author, discussion} = options;
  const contractName = generateContractName(options, proposalType);

  const {chain, baseAsset} = options.market;

  const functions = featureConfig.artifacts
    .map((artifact) => artifact.code?.fn)
    .flat()
    .filter((f) => f !== undefined)
    .join('\n');

  const contract = `/**
  * @title ${title || 'TODO'}
  * @author ${author || 'TODO'}
  * - Discussion: ${discussion || 'TODO'}
  */
 contract ${contractName} is ${baseAsset}${chain}ProposalGenerator {

   ${functions}
 }`;

  return prefixWithPragma(prefixWithImports(options.market, contract, 'proposal'));
};
