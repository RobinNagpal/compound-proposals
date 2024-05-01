import toUpperCamelCase from '../utils/toUpperCamelCase';
import {Market} from '../types';

/**
 * @dev Returns the input string prefixed with imports
 * @param code
 * @returns
 */
let imports = '';
export function prefixWithImports(market: Market, code: string, type: string = 'proposal' || 'test') {
  const baseAssetName = toUpperCamelCase(market.baseAsset.toString());

  imports += `import {IConfigurator} from 'src/contracts/IConfigurator.sol';\n`;
  imports += `import {Structs} from 'src/contracts/structs.sol';\n`;
  imports += `import {GovernanceV3${market.chain}, GovernanceV3${market.chain}Assets} from 'src/contracts/compoundAddresses/GovernanceV3Mainnet.sol';\n`;

  if (type === 'proposal') {
    imports += `import {ICometProxyAdmin} from 'src/contracts/ICometProxyAdmin.sol';\n`;
    imports += `import {${baseAssetName}${market.chain}ProposalGenerator} from 'src/contracts/proposals/${baseAssetName}${market.chain}ProposalGenerator.sol';\n`;
  }

  if (type === 'test') {
    imports += `import {CommonTestBase} from 'src/contracts/CommonTestBase.sol';\n`;
    imports += `import 'src/contracts/proposals/MarketConfig.sol';\n`;
    imports += `import {VmSafe} from 'forge-std/Vm.sol';\n`;
    imports += `import 'forge-std/Test.sol';\n`;
  }

  return imports + code;
}
