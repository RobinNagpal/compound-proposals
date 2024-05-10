import fs from 'fs';
import path from 'path';
import {generateSummary} from '../templates/summary.template';
import {readFile, writeFile} from '../common';

async function generateSummaryProposal(filePath: string) {
  const basePath = path.join(process.cwd(), filePath);

  console.log(basePath);
  if (!fs.existsSync(basePath)) {
    throw new Error('Path does not exist');
  }

  const folderPath = path.dirname(basePath);
  const fileName = path.basename(filePath, '.md');
  const mdContent = readFile(basePath) ?? '';

  const summary = await generateSummary(fileName, mdContent);
  const solFilePath = path.join(folderPath, `${fileName}_Summary.sol`);

  writeFile(solFilePath, summary);
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
  console.error('Please provide a file path as an argument.');
  process.exit(1);
}

generateSummaryProposal(filePath).catch(console.error);
