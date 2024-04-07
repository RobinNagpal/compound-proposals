import fs from 'fs';
import path from 'path';
import { generateContractName, generateFolderName } from './common';
import { proposalTemplate } from './templates/proposal.template';
// import {testTemplate} from './templates/test.template';
import { confirm } from '@inquirer/prompts';
import { ConfigFile, Options, FeatureConfigs } from './types';
import prettier from 'prettier';
import { generateScript } from './templates/script.template';
import { generateCIP } from './templates/cip.template';
import { testTemplate } from './templates/test.template';

interface Files {
  jsonConfig: string;
  script: string;
  cip: string;
  payloads: { payload: string; test: string; contractName: string }[];
}

export async function generateFiles(options: Options, featureConfigs: FeatureConfigs): Promise<Files> {
  const prettierSolCfg = await prettier.resolveConfig('foo.sol');
  const prettierMDCfg = await prettier.resolveConfig('foo.md');
  const prettierTsCfg = await prettier.resolveConfig('foo.ts');

  const jsonConfig = await prettier.format(
    `import { ConfigFile } from './types';
    export const config: ConfigFile = ${JSON.stringify({
      rootOptions: options,
      featureOptions: featureConfigs,
    } as ConfigFile)}`,
    { ...prettierTsCfg, filepath: 'foo.ts' },
  );

  const payloadPromises = Object.keys(featureConfigs).map(async (featureKey) => {
    const contractName = generateContractName(options, featureKey);
    const featureConfig = featureConfigs[featureKey]!;
    // const payload = await prettier.format(proposalTemplate(options, featureConfig, featureKey), {
    //   ...prettierSolCfg,
    //   filepath: `${contractName}.sol`,
    //   parser: 'solidity',
    // });
    const payload = proposalTemplate(options, featureConfig, featureKey);
    // const testCode = testTemplate(options, poolConfigs[pool]!, pool);

    const test = testTemplate(options, featureConfig, featureKey); // Placeholder for test code, adjust as needed

    return { payload, test, contractName };
  });
  const payloads = await Promise.all(payloadPromises);
  console.log('generating script');
  // const script = prettier.format(scriptTemplate(options, featureConfigs), { ...prettierSolCfg, filepath: 'script.sol' });
  const script = 'Placeholder for script content';
  console.log('generating cip');
  // const cip = 'Placeholder for CIP content';
  // const cip = prettier.format(generateCIP(options, featureConfigs), { ...prettierMDCfg, filepath: 'cip.md' });
  const cip = generateCIP(options, featureConfigs);

  return { jsonConfig, script, cip, payloads };
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
export async function writeFiles(options: Options, { jsonConfig, script, cip, payloads }: Files): Promise<void> {
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
    fs.mkdirSync(baseFolder, { recursive: true });
  }

  await askBeforeWrite(options, path.join(baseFolder, 'config.ts'), jsonConfig);
  await askBeforeWrite(options, path.join(baseFolder, `${options.shortName}.md`), cip);

  await askBeforeWrite(options, path.join(baseFolder, `${generateContractName(options)}.s.sol`), script);

  for (const { payload, test, contractName } of payloads) {
    await askBeforeWrite(options, path.join(baseFolder, `${contractName}.sol`), payload);
    await askBeforeWrite(options, path.join(baseFolder, `${contractName}.t.sol`), test);
  }
}
