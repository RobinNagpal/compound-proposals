import fs from 'fs';
import path from 'path';
import {prefixWithPragma} from './constants';
import prettier from 'prettier';

async function generateProposal(filePath: string) {
  const basePath = path.join(process.cwd(), filePath);

  console.log(basePath);
  if (!fs.existsSync(basePath)) {
    throw new Error('Path does not exist');
  }

  const folderPath = path.dirname(basePath);
  const fileName = path.basename(filePath, '.md');
  const mdContent = readMdFile(basePath) ?? '';

  const summary = mdContent;

  const summarySolTemplate = `
    contract ${fileName}_Summary {
        string private summary = ${JSON.stringify(summary)};

        function getSummary() public view returns (string memory) {
            return summary;
          }
    }
    `;

  let summaryProposal = prefixWithPragma(summarySolTemplate);
  const prettierSolCfg = await prettier.resolveConfig('foo.sol');
  try {
    summaryProposal = await prettier.format(summaryProposal, {
      ...prettierSolCfg,
      filepath: `foo.sol`,
      parser: 'solidity-parse',
    });
  } catch (e) {
    console.error('Error formatting solidity proposal', e);
  }

  const solFilePath = path.join(folderPath, `${fileName}_Summary.sol`);

  try {
    fs.writeFileSync(`${solFilePath}`, summaryProposal);
    console.log(`Summary proposal created at ${solFilePath}`);
  } catch (err) {
    console.error(err);
  }
}

function readMdFile(filePath: string) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    console.error(err);
    return null;
  }
}

function extractSection(mdContent: string, sectionTitle: string): string {
  const startTag = `## ${sectionTitle}`;
  const endTag = '##';
  const startIndex = mdContent.indexOf(startTag);
  const endIndex = mdContent.indexOf(endTag, startIndex + startTag.length);

  if (startIndex !== -1 && endIndex !== -1) {
    return mdContent.substring(startIndex, endIndex).trim();
  } else {
    throw new Error(`Section "${sectionTitle}" not found in the Markdown file`);
  }
}

const filePath = process.argv[2];
if (!filePath) {
  console.error('Please provide a folder path as an argument.');
  process.exit(1);
}

generateProposal(filePath).catch(console.error);
