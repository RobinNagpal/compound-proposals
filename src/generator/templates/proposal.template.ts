import { generateContractName } from '../common';
import { FeatureConfig, Options } from '../types';
import { prefixWithPragma } from '../utils/constants';
import { prefixWithImports } from '../utils/importsResolver';

export const proposalTemplate = (options: Options, featureConfig: FeatureConfig, featureKey: string) => {
  const { title, author, snapshot, discussion } = options;
  const contractName = generateContractName(options, featureKey);

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
  * - Snapshot: ${snapshot || 'TODO'}
  * - Discussion: ${discussion || 'TODO'}
  */
 contract ${contractName} {

   ${functions}
 }`;

  return prefixWithPragma(prefixWithImports(contract));
};
