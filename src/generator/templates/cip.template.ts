import { generateContractName, generateFolderName } from '../common';
import { Options, FeatureConfigs } from '../types';

export function generateCIP(options: Options, configs: FeatureConfigs) {
  return `---
title: ${`"${options.title}"` || 'TODO'}
author: ${`"${options.author}"` || 'TODO'}
discussions: ${`"${options.discussion}"` || 'TODO'}
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
        `[${feature}](https://github.com/RobinNagpal/compound-proposals/blob/main/src/${generateFolderName(
          options,
        )}/${generateContractName(options, feature)}.sol)`,
    )
    .join(', ')}
- Tests: ${options.features
    .map(
      (feature) =>
        `[${feature}](https://github.com/RobinNagpal/compound-proposals/blob/main/src/${generateFolderName(
          options,
        )}/${generateContractName(options, feature)}.t.sol)`,
    )
    .join(', ')}

- [Discussion](${options.discussion || 'TODO'})

## Copyright

Copyright and related rights waived via [CC0](https://creativecommons.org/publicdomain/zero/1.0/).\n`;
}
