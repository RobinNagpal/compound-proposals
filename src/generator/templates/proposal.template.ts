import {generateContractName} from '../common';
import {FeatureConfig, ProposalSelections, ProposalType} from '../types';
import {prefixWithPragma} from '../utils/constants';
import {prefixWithImports} from '../utils/importsResolver';
import toUpperCamelCase from '../utils/toUpperCamelCase';

export const proposalTemplate = (proposalSelections: ProposalSelections, featureConfig: FeatureConfig, proposalType: ProposalType) => {
  const {title, author, discussion} = proposalSelections;
  const contractName = generateContractName(proposalSelections, proposalType);

  const {chain, baseAsset} = proposalSelections.market;

  const functions = featureConfig.artifacts
    .map((artifact) => artifact.code?.fn)
    .flat()
    .filter((f) => f !== undefined)
    .join('\n');

  const template = `/**
  * @title ${title || 'TODO'}
  * @author ${author || 'TODO'}
  * - Discussion: ${discussion || 'TODO'}
  */
 contract ${contractName} is ${toUpperCamelCase(baseAsset)}${chain}ProposalGenerator {

   ${functions}
 }`;

  return prefixWithPragma(prefixWithImports(proposalSelections.market, template, 'proposal'));
};
