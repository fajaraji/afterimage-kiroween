import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
// This script lives in backend/scripts. The Kiroween rules keep .kiro/ and LICENSE at the repository root.
const repoRoot = resolve(root, '..');
const read = (file) => (existsSync(file) ? readFileSync(file, 'utf8') : '');
const buildLog = read(`${root}/docs/BUILD_LOG.md`);
const ignored = ['.gitignore', 'backend/.gitignore'].some((f) => /^\s*\.?kiro\/?\s*$/m.test(read(`${repoRoot}/${f}`)));
const checks = [
  ['LICENSE at repo root', existsSync(`${repoRoot}/LICENSE`)],
  ['root .kiro specs present', existsSync(`${repoRoot}/.kiro/specs/06-aws-serverless/tasks.md`)],
  ['.kiro is not gitignored', !ignored],
  ['README present', existsSync(`${repoRoot}/README.md`) && existsSync(`${root}/README.md`)],
  ['Browser API contract present (docs/backend-contract.md)', existsSync(`${repoRoot}/docs/backend-contract.md`)],
  ['Kiro build log has real entries', buildLog.length > 0 && !buildLog.includes('| TODO | TODO |')],
  ['Sanitized evidence file for the recorded run (backend/docs/evidence/)', existsSync(`${root}/docs/evidence`)],
  ['User-filled public GitHub URL, deployed URL and YouTube URL', false],
  ['Erase, scan, restore verified end to end against real AWS', false],
  ['Demo video under 3 minutes shows one real run with the Connected label', false],
];
for (const [name, ok] of checks) console.log(`${ok ? '[PRESENT]' : '[UNVERIFIED]'} ${name}`);
console.log('This script cannot verify hosted URLs, real Kiro usage, or completed functionality. Items marked PRESENT only show that a file exists. Do not claim more than that.');