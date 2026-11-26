import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const quiet = process.argv.includes('--quiet');
const required = [
  'README.md', 'AGENTS.md', 'LICENSE', 'package.json', '.gitignore',
  '.kiro/README.md', '.kiro/settings/mcp.json', '.kiro/hooks/workspace-check.json',
  '.kiro/steering/00-product.md', '.kiro/steering/01-guardrails.md',
  'docs/PRD.md', 'docs/SECURITY-PRIVACY.md', 'docs/HACKATHON.md',
  'docs/FRANKENSTEIN-STRATEGY.md', 'docs/FRANKENSTEIN-EVIDENCE-MATRIX.md',
  'docs/AGENT-SAFETY-FINDINGS.md', 'docs/AGENT-ACTION-FORENSICS.md',
  'docs/AGENT-ACTION-THREAT-MODEL.md', 'docs/DECISIONS/0006-consequential-agent-actions.md',
  '.kiro/steering/23-agent-action-safety.md',
  '.kiro/skills/agent-action-threat-review/SKILL.md',
  '.kiro/steering/22-frankenstein.md', '.kiro/skills/frankenstein-demo-audit/SKILL.md',
  'apps/web/package.json', 'apps/api/package.json',
  'packages/engine/package.json', 'packages/contracts/package.json',
  'fixtures/scenario.schema.json'
];
const errors = [];
for (const file of required) if (!existsSync(join(root, file))) errors.push(`Missing required file: ${file}`);
if (existsSync(join(root, '.gitignore')) && /^\s*\.?kiro\/?\s*$/m.test(readFileSync(join(root, '.gitignore'), 'utf8'))) {
  errors.push('DO NOT ignore .kiro/ in .gitignore (Kiroween requirement).');
}
for (const folder of ['01-foundation','02-deletion-replay','03-verification','04-investigation-ui','05-reporting-submission','06-aws-serverless','07-strands-investigator','08-frankenstein-integration','09-consequential-action-safety']) {
  for (const file of ['requirements.md','design.md','tasks.md']) {
    const p = `.kiro/specs/${folder}/${file}`;
    if (!existsSync(join(root, p))) errors.push(`Missing spec: ${p}`);
  }
}
const jsonFiles = ['fixtures/agent-actions/action-trace.schema.json', 'package.json','.kiro/settings/mcp.json','.kiro/hooks/workspace-check.json','fixtures/scenario.schema.json'];
for (const entry of readdirSync(join(root,'fixtures/scenarios'))) if (entry.endsWith('.json')) jsonFiles.push(`fixtures/scenarios/${entry}`);
for (const entry of readdirSync(join(root,'fixtures/agent-actions'))) if (entry.endsWith('.json')) jsonFiles.push(`fixtures/agent-actions/${entry}`);
for (const file of jsonFiles) {
  try { JSON.parse(readFileSync(join(root, file), 'utf8')); }
  catch (error) { errors.push(`Invalid JSON ${file}: ${error.message}`); }
}
for (const entry of readdirSync(join(root,'fixtures/scenarios'))) {
  if (!entry.endsWith('.json')) continue;
  const data = JSON.parse(readFileSync(join(root,'fixtures/scenarios',entry),'utf8'));
  if (!data.fixture?.subjectId?.startsWith('synthetic-')) errors.push(`Non-synthetic fixture subject: ${entry}`);
  const allowed = new Set(['seed_subject','hold_upsert','delete_subject','release_held','inject_delete_failure','mark_store_unreachable','verify']);
  for (const step of data.steps || []) if (!allowed.has(step.action)) errors.push(`Unsupported action in ${entry}: ${step.action}`);
}
// Illustrative action traces must never be misrepresented as executed AWS results.
for (const entry of readdirSync(join(root,'fixtures/agent-actions'))) {
  if (!entry.endsWith('.json') || entry.endsWith('.schema.json')) continue;
  const data = JSON.parse(readFileSync(join(root,'fixtures/agent-actions',entry), 'utf8'));
  if (data.illustrativeOnly !== true || !data.runId?.startsWith('synthetic-')) errors.push(`Unsafe illustrative action fixture: ${entry}`);
  if (data.intent?.operation !== 'DROP_SYNTHETIC_TABLE_PROPOSAL' || data.policyDecision?.outcome !== 'DENY' || data.executionReceipt?.status !== 'NOT_EXECUTED') errors.push(`Action fixture must be denied and not executed: ${entry}`);
  if (!['PRESENT','UNKNOWN'].includes(data.postActionObservation?.state)) errors.push(`Bad post-denial observation state: ${entry}`);
}
if (errors.length) {
  console.error(`Workspace validation failed with ${errors.length} issue(s):\n${errors.map((e)=>'- '+e).join('\n')}`);
  process.exitCode = 1;
} else if (!quiet) {
  console.log('Workspace structure and JSON checks passed (not a functional app test).');
}
