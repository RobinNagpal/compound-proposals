import { generateContractName } from '../common';
import { FEATURE, Options, FeatureConfig } from '../types';
import { prefixWithImports } from '../utils/importsResolver';
import { prefixWithPragma } from '../utils/constants';

export const proposalTemplate = (options: Options, featureConfig: FeatureConfig, featureKey: string) => {
  const { title, author, snapshot, discussion } = options;
  const contractName = generateContractName(options, featureKey);
  // const poolName = pool.match(/AaveV[2|3](.*)/)![1];
  // const version = getVersion(pool);

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

  let optionalExecute = '';
  const isAssetListing = Object.keys(featureConfig.configs).some((f) => [FEATURE.ADD_ASSET].includes(f as FEATURE));
  if (innerExecute) {
    // if (usesConfigEngine) {
    //   optionalExecute = `function _postExecute() internal override {
    //     ${innerExecute}
    //    }`;
    // } else {
    optionalExecute = `function execute() external {
        ${innerExecute}
       }`;
    // }
  }

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
