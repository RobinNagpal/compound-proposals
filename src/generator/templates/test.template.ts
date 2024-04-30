import {generateContractName, getChainAlias} from '../common';
import {Options, FeatureConfig, ProposalType} from '../types';
import {prefixWithPragma} from '../utils/constants';
import {prefixWithImports} from '../utils/importsResolver';

export const testTemplate = (options: Options, featureConfig: FeatureConfig, proposalType: ProposalType) => {
  const contractName = generateContractName(options, proposalType);

  const chain = options.market.chain;

  const functions = featureConfig.artifacts
    .map((artifact) => artifact.test?.fn)
    .flat()
    .filter((f) => f !== undefined)
    .join('\n');

  let template = `
  import {${contractName}} from './${contractName}.sol';

/**
 * @dev Test for ${contractName}
 * command: make test-contract filter=${contractName}
 */
contract ${contractName}_Test is CommonTestBase {
  ${contractName} internal proposal;

  function setUp() public {
    vm.createSelectFork(vm.rpcUrl(${chain.toLowerCase()}), 18544451);
    proposal = new ${contractName}();
  }

  ${functions}
}`;
  return prefixWithPragma(prefixWithImports(options.market, template, 'test'));
};
