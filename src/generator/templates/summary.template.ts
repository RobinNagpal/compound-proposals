import prettier from 'prettier';
import {prefixWithPragma} from '../utils/constants';

export async function generateSummary(contractName: string, mdContent: string) {
  const summarySolTemplate = `
        contract ${contractName}_Summary {
            string private summary = ${JSON.stringify(mdContent)};
    
            function getSummary() public view returns (string memory) {
                return summary;
              }
        }
        `;

  let summaryProposal = prefixWithPragma(summarySolTemplate);
  const prettierSolCfg = await prettier.resolveConfig('foo.sol');
  try {
    summaryProposal = await prettier.format(summaryProposal, {
      ...prettierSolCfg,
      filepath: `foo.sol`,
      parser: 'solidity-parse',
    });
  } catch (e) {
    console.error('Error formatting solidity proposal', e);
  }

  return summaryProposal;
}
