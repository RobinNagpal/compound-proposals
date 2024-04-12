import { generateContractName } from '../common';
import { FeatureConfig, Options, ProposalType } from '../types';
import { prefixWithPragma } from '../utils/constants';
import { prefixWithImports } from '../utils/importsResolver';

export const proposalTemplate = (options: Options, featureConfig: FeatureConfig, proposalType: ProposalType) => {
  const { title, author, discussion } = options;
  const contractName = generateContractName(options, proposalType);

  const constants = featureConfig.artifacts
    .map((artifact) => artifact.code?.constants)
    .flat()
    .filter((f) => f !== undefined)
    .join('\n');
  const functions = featureConfig.artifacts
    .map((artifact) => artifact.code?.fn)
    .flat()
    .filter((f) => f !== undefined)
    .join('\n');
  const innerExecute = featureConfig.artifacts
    .map((artifact) => artifact.code?.execute)
    .flat()
    .filter((f) => f !== undefined)
    .join('\n');

  const contract = `/**
  * @title ${title || 'TODO'}
  * @author ${author || 'TODO'}
  * - Discussion: ${discussion || 'TODO'}
  */
 contract ${contractName} {

   ${functions}
 }`;

  return prefixWithPragma(prefixWithImports(contract));
};
