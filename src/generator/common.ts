import {arbitrum, avalanche, base, mainnet, metis, optimism, polygon, scroll} from 'viem/chains';
import {MarketAndAssetConfig, Options, ProposalType} from './types';
import fs from 'fs';

export function getDate() {
  const date = new Date();
  const years = date.getFullYear();
  const months = date.getMonth() + 1; // it's js so months are 0 indexed
  const day = date.getDate();
  return `${years}${months <= 9 ? '0' : ''}${months}${day <= 9 ? '0' : ''}${day}`;
}

/**
 * Prefix with the date for proper sorting
 * @param {*} options
 * @returns
 */
export function generateFolderName(options: Options) {
  return `${options.date}_${options.features.length === 1 ? options.features[0] : 'Multi'}_${options.shortName}`;
}

export function generateProposalName(options: Options, marketAndAssetConfig: MarketAndAssetConfig) {
  return `${options.shortName}_${marketAndAssetConfig.asset.asset.split('_')[0]}_${marketAndAssetConfig.market.chain}_${options.date}`;
}

export function getChainAlias(chain: string) {
  return chain === 'Ethereum' ? 'mainnet' : chain.toLowerCase();
}

export function pascalCase(str: string) {
  return str
    .replace(/[\W]/g, ' ') // remove special chars as this is used for solc contract name
    .replace(/(\w)(\w*)/g, function (g0, g1, g2) {
      return g1.toUpperCase() + g2;
    })
    .replace(/ /g, '');
}

export const CHAIN_TO_CHAIN_ID = {
  Ethereum: mainnet.id,
  Polygon: polygon.id,
  Optimism: optimism.id,
  Arbitrum: arbitrum.id,
  Avalanche: avalanche.id,
  Metis: metis.id,
  Base: base.id,
  Scroll: scroll.id,
};

export function flagAsRequired(message: string, required?: boolean) {
  return required ? `${message}*` : message;
}

export function readFile(filePath: string) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    console.error(err);
    return null;
  }
}

export function writeFile(filePath: string, content: string) {
  try {
    fs.writeFileSync(`${filePath}`, content);
  } catch (err) {
    console.error(err);
  }
}
