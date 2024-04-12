import {Hex, getAddress, isAddress} from 'viem';
import {GenericPrompt} from './types';
import {advancedInput} from './advancedInput';
import {flagAsRequired} from '../common';

export async function addressPrompt<T extends boolean>(
  {message, required, defaultValue}: GenericPrompt<T>,
  opts?: object,
): Promise<T extends true ? Hex : Hex | ''> {
  const value = await advancedInput(
    {
      message: flagAsRequired(message, required),
      validate: (v: string) => (required ? isAddress(v) : isAddress(v) || v === ''),
      pattern: /^(0|0x|0x[A-Fa-f0-9]{0,40})?$/,
      default: defaultValue,
    },
    opts,
  );
  return value as Hex;
}

export function translateJsAddressToSol(value?: string) {
  if (!value) return `EngineFlags.KEEP_CURRENT_ADDRESS`;
  return getAddress(value);
}
