import fs from 'fs';
import path from 'path';
import {generateScript} from './templates/script.template';
import {generateFolderName, generateProposalName, writeFile} from './common';
import {proposalTemplate} from './templates/proposal.template';
import {confirm} from '@inquirer/prompts';
import {ConfigFile, Options, FeatureConfigs, ProposalType, ProposalSelections, MarketAndAssetConfig} from './types';
import prettier from 'prettier';
import {generateCIP} from './templates/cip.template';
import {testTemplate} from './templates/test.template';
import {generateSummary} from './templates/summary.template';

type FileInfo = {proposal: string; test: string; script: string; contractName: string};

interface Files {
  cip: string;
  proposals: FileInfo[];
}

export async function generateFiles(
  proposalSelections: ProposalSelections,
  featureConfigs: FeatureConfigs,
  marketAndAssetConfig: MarketAndAssetConfig,
): Promise<Files> {
  const prettierSolCfg = await prettier.resolveConfig('foo.sol');
  const prettierMDCfg = await prettier.resolveConfig('foo.md');

  const selectedProposalTypes = Object.keys(featureConfigs) as ProposalType[];

  const contractName = generateProposalName(proposalSelections, marketAndAssetConfig);
  const proposals: FileInfo[] = [];
  for (const proposalType of selectedProposalTypes) {
    const featureConfig = featureConfigs[proposalType]!;

    const unformattedProposal = proposalTemplate(proposalSelections, featureConfig, contractName);
    let proposal = unformattedProposal;
    try {
      proposal = await prettier.format(unformattedProposal, {
        ...prettierSolCfg,
        filepath: `foo.sol`,
        parser: 'solidity-parse',
      });
    } catch (e) {
      console.error('Error formatting solidity proposal', e);
    }

    const unformattedTest = testTemplate(proposalSelections, featureConfig, contractName);
    let test = unformattedTest;
    try {
      test = await prettier.format(unformattedTest, {
        ...prettierSolCfg,
        filepath: `foo.sol`,
        parser: 'solidity-parse',
      });
    } catch (e) {
      console.error('Error formatting solidity test', e);
    }

    const unformattedScriptTemplate = generateScript(proposalSelections, contractName);
    let script = unformattedScriptTemplate;
    try {
      script = await prettier.format(unformattedScriptTemplate, {...prettierSolCfg, filepath: 'foo.sol'});
    } catch (e) {
      console.error('Error formatting solidity script', e);
    }
    proposals.push({proposal, test, script, contractName});
  }

  const cip = await prettier.format(generateCIP(proposalSelections, featureConfigs, contractName), {...prettierMDCfg, filepath: 'cip.md'});
  console.log('Generating all files for the proposal');

  return {cip, proposals};
}

async function askBeforeWrite(options: Options, filePath: string, content: string): Promise<void> {
  if (!options.force && fs.existsSync(filePath)) {
    const force = await confirm({
      message: `A file already exists at ${filePath}. Do you want to overwrite it?`,
      default: false,
    });
    if (!force) return;
  }

  fs.writeFileSync(filePath, content);
}

/**
 * Writes the files according to defined folder/file format
 * @param options
 * @param param1
 */
export async function writeFiles(options: Options, {cip, proposals}: Files, marketAndAssetConfig: MarketAndAssetConfig): Promise<void> {
  const baseName = generateFolderName(options);
  const baseFolder = path.join(process.cwd(), 'src/proposals', baseName);

  if (fs.existsSync(baseFolder)) {
    if (!options.force && fs.existsSync(baseFolder)) {
      const force = await confirm({
        message: 'A proposal already exists at that location, do you want to continue?',
        default: false,
      });
      if (!force) return;
    }
  } else {
    fs.mkdirSync(baseFolder, {recursive: true});
  }

  const contractName = generateProposalName(options, marketAndAssetConfig);
  await askBeforeWrite(options, path.join(baseFolder, `${contractName}.md`), cip);

  const summary = await generateSummary(contractName, cip);
  writeFile(path.join(baseFolder, `${contractName}_Summary.sol`), summary);

  for (const {proposal, test, script, contractName} of proposals) {
    await askBeforeWrite(options, path.join(baseFolder, `${contractName}.s.sol`), script);
    await askBeforeWrite(options, path.join(baseFolder, `${contractName}.sol`), proposal);
    await askBeforeWrite(options, path.join(baseFolder, `${contractName}.t.sol`), test);
  }
}
