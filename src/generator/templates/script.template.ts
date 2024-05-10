import {generateContractName, generateFolderName} from '../common';
import {FeatureConfig, FeatureConfigs, ProposalSelections, ProposalType} from '../types';
import {prefixWithPragma} from '../utils/constants';
import {prefixWithImports} from '../utils/importsResolver';

export function generateScript(proposalSelections: ProposalSelections, proposalType: ProposalType) {
  const folderName = generateFolderName(proposalSelections);
  const contractName = generateContractName(proposalSelections, proposalType);
  const baseContractName = generateContractName(proposalSelections);
  let chain = proposalSelections.market.chain === 'Mainnet' ? 'Ethereum' : proposalSelections.market.chain;
  let template = '';
  // generate imports
  template += `import {${chain}Script} from 'src/contracts/ScriptUtils.sol';\n`;
  template += `import {${contractName}} from './${contractName}.sol';\n`;
  template += `import {${baseContractName}_Summary} from './${baseContractName}_Summary.sol';\n`;

  // generate proposal creation script
  template += `/**
 * @dev Create Proposal
 * command: make deploy-ledger contract=src/${folderName}/${contractName}.s.sol:CreateProposal chain=mainnet
 */

contract CreateProposal is ${chain}Script {
  ${contractName} internal proposal;
  ${baseContractName}_Summary internal description;

  IGovernanceBravo governor;

  function setUp() public {
    proposal = new ${contractName}();
    description = new ${baseContractName}_Summary();
    governor = IGovernanceBravo(GovernanceV3.GOVERNOR_BRAVO);
  }

  function run() external {
    Structs.ProposalInfo memory proposalInfo = proposal.createProposalPayload();
    string memory summary = description.getSummary();
    vm.startBroadcast(msg.sender);

    try
      governor.propose(
        proposalInfo.targets,
        proposalInfo.values,
        proposalInfo.signatures,
        proposalInfo.calldatas,
        summary
      )
    {
      vm.stopBroadcast();

      console.log('Proposal created successfully');
    } catch Error(string memory reason) {
      console.log('Error: ', reason);
    } catch (bytes memory) {
      console.log('Error: Unknown reason');
    }
  }
}`;
  return prefixWithPragma(prefixWithImports(proposalSelections.market, template, 'script'));
}
