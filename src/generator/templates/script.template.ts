import { generateContractName, generateFolderName } from '../common';
import { FeatureConfig, FeatureConfigs, Options } from '../types';
import { prefixWithPragma } from '../utils/constants';
import { prefixWithImports } from '../utils/importsResolver';

export function generateScript(options: Options, featureConfig: FeatureConfigs) {
  const folderName = generateFolderName(options);
  const fileName = generateContractName(options);
  let template = '';
  // generate imports
  template += `import {EthereumScript} from 'src/contracts/ScriptUtils.sol';\n`;

  // generate proposal creation script
  template += `/**
 * @dev Create Proposal
 * command: make deploy-ledger contract=src/${folderName}/${fileName}.s.sol:CreateProposal chain=mainnet
 */
contract CreateProposal is EthereumScript {
  function run() external {
     // create the proposal
  }
}`;
  return prefixWithPragma(prefixWithImports(template));
}
