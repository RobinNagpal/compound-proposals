import {generateContractName, getChainAlias} from '../common';
import {Options, FeatureConfig, ProposalType} from '../types';
import {prefixWithPragma} from '../utils/constants';
import {prefixWithImports} from '../utils/importsResolver';

export const testTemplate = (options: Options, featureConfig: FeatureConfig, proposalType: ProposalType) => {
  //   const chain = getPoolChain(pool);
  const contractName = generateContractName(options, proposalType);

  const functions = featureConfig.artifacts
    .map((artifact) => artifact.test?.fn)
    .flat()
    .filter((f) => f !== undefined)
    .join('\n');

  let template = `
  import {${contractName}} from './${contractName}.sol';
  import {CommonTestBase} from 'src/contracts/CommonTestBase.sol';
  import {IConfigurator} from 'src/contracts/IConfigurator.sol';
  import {VmSafe} from 'forge-std/Vm.sol';
  import 'forge-std/console.sol';
  import 'forge-std/Test.sol';



/**
 * @dev Test for ${contractName}
 * command: make test-contract filter=${contractName}
 */
contract ${contractName}_Test is CommonTestBase {
  ${contractName} internal proposal;

  function setUp() public {
    vm.createSelectFork(vm.rpcUrl('mainnet'), 18544451);
    proposal = new ${contractName}();
  }

  ${functions}
}`;
  return prefixWithPragma(template);
};
