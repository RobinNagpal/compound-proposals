export function prefixWithPragma(code: string) {
  return (
    `// SPDX-License-Identifier: MIT
    pragma solidity ^0.8.15;\n\n` + code
  );
}
