import path from 'path';
import { Command, Option } from 'commander';

import { input, checkbox } from '@inquirer/prompts';
import { SupportedChains, Options, FeatureModule, FEATURE, CodeArtifact, BaseAssets, ConfigFile, FeatureConfigs } from './types';
import { addAsset } from './features/addAsset';
import { getDate, pascalCase } from './common';
import { generateFiles, writeFiles } from './generator';

async function runCLI() {
  const program = new Command();

  program
    .name('proposal-generator')
    .description('CLI to generate Compound proposals')
    .version('1.0.0')
    .addOption(new Option('-p, --market <markets...>').choices(SupportedChains))
    .addOption(new Option('-t, --title <string>', 'proposal title'))
    .addOption(new Option('-a, --author <string>', 'author'))
    .addOption(new Option('-d, --discussion <string>', 'forum link'))
    .allowExcessArguments(false)
    .parse(process.argv);

  let options = program.opts<Options>();
  let featureConfigs: FeatureConfigs = {};

  const PLACEHOLDER_MODULE: FeatureModule<{}> = {
    description: 'Something different not supported by configEngine',
    value: FEATURE.OTHERS,
    cli: async ({}) => {
      return {};
    },
    build: ({}) => {
      const response: CodeArtifact = {
        code: { execute: ['// custom code goes here'] },
      };
      return response;
    },
  };

  const FEATURES = [addAsset, PLACEHOLDER_MODULE];
  // if (!options.configFile) {
  // const {config: cfgFile}: {config: ConfigFile} = await import(
  //   path.join(process.cwd(), options.configFile)
  // );
  // options = {...options, ...cfgFile.rootOptions};
  // poolConfigs = cfgFile.poolOptions as any;
  // for (const pool of options.pools) {
  //   const v2 = isV2Pool(pool);
  //   poolConfigs[pool]!.artifacts = [];
  //   for (const feature of Object.keys(poolConfigs[pool]!.configs)) {
  //     const module = v2
  //       ? FEATURE_MODULES_V2.find((m) => m.value === feature)!
  //       : FEATURE_MODULES_V3.find((m) => m.value === feature)!;
  //     poolConfigs[pool]!.artifacts.push(
  //       module.build({
  //         options,
  //         pool,
  //         cfg: poolConfigs[pool]!.configs[feature],
  //         cache: poolConfigs[pool]!.cache,
  //       })
  //     );
  //   }
  // }
  // } else {
  options.features = await checkbox({
    message: `What do you want to do?`,
    required: true,
    choices: FEATURES.map((m) => ({ value: m.value, name: m.description })),
  });
  for (const feature of options.features) {
    const module = FEATURES.find((m) => m.value === feature)!;
    featureConfigs[feature] = {
      configs: {},
      artifacts: [],
    };
    featureConfigs[feature]!.configs[feature]! = await module.cli({
      options,
    });

    featureConfigs[feature]!.artifacts.push(
      module.build({
        options,
        cfg: featureConfigs[feature]!.configs[feature],
      }),
    );
  }

  if (!options.title) {
    options.title = await input({
      message: 'Title of your proposal',
      validate(input) {
        if (input.length == 0) return "Your title can't be empty";
        if (input.trim().length > 80) return 'Your title is to long';
        return true;
      },
    });
  }
  options.shortName = pascalCase(options.title);
  options.date = getDate();

  if (!options.author) {
    options.author = await input({
      message: 'Author of your proposal',
      validate(input) {
        if (input.length == 0) return "Your author can't be empty";
        return true;
      },
    });
  }

  if (!options.discussion) {
    options.discussion = await input({
      message: 'Link to forum discussion',
    });
  }

  if (!options.snapshot) {
    options.snapshot = await input({
      message: 'Link to snapshot',
    });
  }
  try {
    const files = await generateFiles(options, featureConfigs);
    await writeFiles(options, files);
  } catch (e) {
    console.log('Error: ', e);
    throw e;
  }
}

runCLI().catch((error) => {
  console.error('An error occurred:', error);
});
