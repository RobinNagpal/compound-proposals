export function prefixWithPragma(code: string) {
  return (
    `// SPDX-License-Identifier: MIT
    pragma solidity ^0.8.15;\n\n` + code
  );
}

export const Addresses = {
  configuratorAddress: '0x316f9708bB98af7dA9c68C1C3b5e79039cD336E3',
  cometProxyAdminAddress: '0x1EC63B5883C3481134FD50D5DAebc83Ecd2E8779',
  cometProxyAddress: '0xA17581A9E3356d9A858b789D68B4d866e593aE94',
  governorAddress: '0x6d903f6003cca6255D85CcA4D3B5E5146dC33925',
};
