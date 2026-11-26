import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
// This script lives in backend/scripts. The Kiroween rules keep .kiro/ and LICENSE at the repository root.
const repoRoot = resolve(root, '..');
const at = (file) => join(file === 'LICENSE' || file.startsWith('.kiro/') ? repoRoot : root, file);
const quiet = process.argv.includes('--quiet');
const required = [
  'README.md', 'AGENTS.md', 'LICENSE', 'package.json', '.gitignore',
  '.kiro/README.md', '.kiro/settings/mcp.json', '.kiro/hooks/workspace-check.json',
  '.kiro/steering/00-product.md', '.kiro/steering/01-guardrails.md', '.kiro/steering/20-aws-first.md',
  'docs/SECURITY-PRIVACY.md', 'docs/HACKATHON.md', 'docs/ARCHITECTURE.md',
  'docs/DECISIONS/0007-costume-contest-category.md', 'docs/DECISIONS/0008-no-cookies-reset-on-reload.md',
  'docs/FRONTEND-REQUESTS.md',
  'apps/api/package.json',
  'packages/engine/package.json', 'packages/contracts/package.json', 'packages/aws-adapters/package.json'
];
const errors = [];
for (const file of required) if (!existsSync(at(file))) errors.push(`Missing required file: ${file}`);
for (const ignoreFile of [join(root, '.gitignore'), join(repoRoot, '.gitignore')]) {
  if (existsSync(ignoreFile) && /^\s*\.?kiro\/?\s*$/m.test(readFileSync(ignoreFile, 'utf8'))) {
    errors.push(`DO NOT ignore .kiro/ in ${ignoreFile} (Kiroween requirement).`);
  }
}
for (const folder of ['01-foundation','02-deletion-replay','03-verification','05-reporting-submission','06-aws-serverless']) {
  for (const file of ['requirements.md','design.md','tasks.md']) {
    const p = `.kiro/specs/${folder}/${file}`;
    if (!existsSync(at(p))) errors.push(`Missing spec: ${p}`);
  }
}
const jsonFiles = ['package.json', '.kiro/settings/mcp.json', '.kiro/hooks/workspace-check.json'];
for (const entry of readdirSync(join(repoRoot, '.kiro/agents'))) if (entry.endsWith('.json')) jsonFiles.push(`.kiro/agents/${entry}`);
for (const file of jsonFiles) {
  try { JSON.parse(readFileSync(at(file), 'utf8')); }
  catch (error) { errors.push(`Invalid JSON ${file}: ${error.message}`); }
}
// Every task in an active spec should name a requirement ID, except legacy tasks whose titles are kept for Kiro run history.
for (const folder of ['01-foundation','02-deletion-replay','03-verification','05-reporting-submission','06-aws-serverless']) {
  const text = readFileSync(at(`.kiro/specs/${folder}/tasks.md`), 'utf8');
  const unmapped = text.split('\n').filter((l) => /^- \[.\] /.test(l) && !/\([A-Z]+-\d+/.test(l));
  if (folder !== '01-foundation' && unmapped.length) errors.push(`Tasks without requirement IDs in ${folder}: ${unmapped.length}`);
}if (errors.length) {
  console.error(`Workspace validation failed with ${errors.length} issue(s):\n${errors.map((e)=>'- '+e).join('\n')}`);
  process.exitCode = 1;
} else if (!quiet) {
  console.log('Workspace structure and JSON checks passed (not a functional app test).');
}
