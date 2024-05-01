import {checkbox, input} from '@inquirer/prompts';
import {Command} from 'commander';
import {getDate, pascalCase} from './common';
import {generateFiles, writeFiles} from './generator';
import {addAsset} from './proposalTypes/addAsset';
import {CodeArtifact, FeatureModule, Options, ProposalType} from './types';

async function runCLI() {
  const program = new Command();

  const options = program.opts<Options>();

  const TypeOfCompoundProposals = [addAsset];

  options.features = await checkbox({
    message: `What do you want to do?`,
    required: true,
    choices: TypeOfCompoundProposals.map((m) => ({value: m.value, name: m.description})),
  });

  const feature = options.features?.[0];

  const selectedProposalType: FeatureModule<any> = TypeOfCompoundProposals.find((m) => m.value === feature)!;

  const selectedProposalConfig = await selectedProposalType.cli({
    options,
  });

  const codeArtifact = selectedProposalType.build({
    options,
    cfg: selectedProposalConfig,
  });

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

  try {
    console.log('Generating files with options:', options, selectedProposalConfig, selectedProposalType);

    const files = await generateFiles(
      {...options, market: selectedProposalConfig.market},
      {
        [feature]: {
          configs: selectedProposalConfig,
          artifacts: [codeArtifact],
        },
      },
    );
    await writeFiles(options, files);
  } catch (e) {
    console.log('Error: ', e);
    throw e;
  }
}

runCLI().catch((error) => {
  console.error('An error occurred:', error);
});
