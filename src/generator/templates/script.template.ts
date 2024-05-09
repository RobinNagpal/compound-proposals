import {generateContractName, generateFolderName} from '../common';
import {FeatureConfig, FeatureConfigs, ProposalSelections} from '../types';
import {prefixWithPragma} from '../utils/constants';
import {prefixWithImports} from '../utils/importsResolver';

export function generateScript(proposalSelections: ProposalSelections, featureConfig: FeatureConfigs) {
  const folderName = generateFolderName(proposalSelections);
  const contractName = generateContractName(proposalSelections);
  let chain = proposalSelections.market.chain === 'Mainnet' ? 'Ethereum' : proposalSelections.market.chain;
  let template = '';
  // generate imports
  template += `import {${chain}Script} from 'src/contracts/ScriptUtils.sol';\n`;
  template += `import {${contractName}} from './${contractName}.sol';\n`;

  // generate proposal creation script
  template += `/**
 * @dev Create Proposal
 * command: make deploy-ledger contract=src/${folderName}/${contractName}.s.sol:CreateProposal chain=mainnet
 */

contract CreateProposal is ${chain}Script {
  AddAsset_Add_rETH_WETH_Mainnet_20240412 internal proposal;
  IGovernanceBravo governor;

  function setUp() public {
    proposal = new ${contractName}();
    governor = IGovernanceBravo(GovernanceV3.GOVERNOR_BRAVO);
  }

  function run() external {
    Structs.ProposalInfo memory proposalInfo = proposal.createProposalPayload();
    vm.startBroadcast(msg.sender);

    try
      governor.propose(
        proposalInfo.targets,
        proposalInfo.values,
        proposalInfo.signatures,
        proposalInfo.calldatas,
        'Description'
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
