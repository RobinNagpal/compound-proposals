import { generateContractName, getChainAlias } from '../common';
import { Options, FeatureConfig } from '../types';
import { prefixWithPragma } from '../utils/constants';
import { prefixWithImports } from '../utils/importsResolver';

export const testTemplate = (options: Options, featureConfig: FeatureConfig, featureKey: string) => {
//   const chain = getPoolChain(pool);
  const contractName = generateContractName(options, featureKey);

//   const testBase = isV2Pool(pool) ? 'ProtocolV2TestBase' : 'ProtocolV3TestBase';
  const testBase = 'ProtocolV3TestBase';

  const functions = featureConfig.artifacts
    .map((artifact) => artifact.test?.fn)
    .flat()
    .filter((f) => f !== undefined)
    .join('\n');

  let template = `
import 'forge-std/Test.sol';
import {${testBase}, ReserveConfig} from 'aave-helpers/${testBase}.sol';
import {${contractName}} from './${contractName}.sol';

/**
 * @dev Test for ${contractName}
 * command: make test-contract filter=${contractName}
 */
contract ${contractName}_Test is ${testBase} {
  ${contractName} internal proposal;

  function setUp() public {
    vm.createSelectFork(vm.rpcUrl('${getChainAlias(chain)}'), ${poolConfig.cache.blockNumber});
    proposal = new ${contractName}();
  }

  /**
   * @dev executes the generic test suite including e2e and config snapshots
   */
  function test_defaultProposalExecution() public {
    defaultTest('${contractName}', ${pool}.POOL, address(proposal));
  }

  ${functions}
}`;
  return prefixWithPragma(prefixWithImports(template));
};
