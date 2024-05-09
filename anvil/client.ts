import {createTestClient, http} from 'viem';
import {foundry} from 'viem/chains';

export const testClient = createTestClient({
  chain: foundry,
  mode: 'anvil',
  transport: http(),
});
