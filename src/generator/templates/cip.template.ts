import { generateContractName, generateFolderName } from '../common';
import { Options, FeatureConfigs } from '../types';

export function generateCIP(options: Options, configs: FeatureConfigs) {
  return `---
title: ${`"${options.title}"` || 'TODO'}
author: ${`"${options.author}"` || 'TODO'}
discussions: ${`"${options.discussion}"` || 'TODO'}${options.snapshot ? `\nsnapshot: "${options.snapshot}"\n` : ''}
---

## Simple Summary

## Motivation

## Specification

${Object.keys(configs)
  .map((pool) => {
    return configs[pool as keyof typeof configs]!.artifacts.filter((artifact) => artifact.cip?.specification).map((artifact) => artifact.cip?.specification);
  })
  .filter((a) => a)
  .join('\n\n')}

## References

- Implementation: ${options.features
    .map(
      (feature) =>
        `[${feature}](https://github.com/bgd-labs/aave-proposals-v3/blob/main/src/${generateFolderName(
          options,
        )}/${generateContractName(options, feature)}.sol)`,
    )
    .join(', ')}
- Tests: ${options.features
    .map(
      (feature) =>
        `[${feature}](https://github.com/bgd-labs/aave-proposals-v3/blob/main/src/${generateFolderName(
          options,
        )}/${generateContractName(options, feature)}.t.sol)`,
    )
    .join(', ')}
- [Snapshot](${options.snapshot || 'TODO'})
- [Discussion](${options.discussion || 'TODO'})

## Copyright

Copyright and related rights waived via [CC0](https://creativecommons.org/publicdomain/zero/1.0/).\n`;
}
