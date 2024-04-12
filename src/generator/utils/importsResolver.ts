/**
 * @dev Returns the input string prefixed with imports
 * @param code
 * @returns
 */
let imports = '';
export function prefixWithImports(code: string) {
  imports += `import {IConfigurator} from 'src/contracts/IConfigurator.sol';\n`;
  imports += `import {ICometProxyAdmin} from 'src/contracts/ICometProxyAdmin.sol';\n`;
  imports += `import {Structs} from 'src/contracts/structs.sol';\n`;
  imports += `import {CommonTestBase} from 'src/contracts/CommonTestBase.sol';\n`;
  imports += `import {VmSafe} from 'forge-std/Vm.sol';\n`;
  imports += `import 'forge-std/console.sol';\n`;
  return imports + code;
}
