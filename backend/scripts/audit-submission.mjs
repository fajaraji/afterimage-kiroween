import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname,'..');
const checks = [
  ['LICENSE', existsSync(`${root}/LICENSE`)],
  ['root .kiro specs', existsSync(`${root}/.kiro/specs/01-foundation/tasks.md`)],
  ['Frankenstein spec and evidence guide', existsSync(`${root}/.kiro/specs/08-frankenstein-integration/tasks.md`) && existsSync(`${root}/docs/FRANKENSTEIN-EVIDENCE-MATRIX.md`)],
  ['README', existsSync(`${root}/README.md`)],
  ['v4 P1/P2 scope docs and spec present (not proof of implementation)', existsSync(`${root}/.kiro/specs/09-consequential-action-safety/tasks.md`) && existsSync(`${root}/docs/AGENT-ACTION-THREAT-MODEL.md`)],
  ['Kiro build log has real entries', !readFileSync(`${root}/docs/BUILD_LOG.md`,'utf8').includes('| TODO | TODO |')],
  ['User-filled public GitHub URL / deployed URL / YouTube', false],
  ['Working deletion regression lab verified end-to-end', false],
  ['Real AWS + read-only Strands + Ghost Graph integration verified', false],
  ['Optional agent-action enforcement with independent observations verified (do not claim unless executed)', false],
];
for (const [name,ok] of checks) console.log(`${ok?'[PRESENT]':'[UNVERIFIED]'} ${name}`);
console.log('This script cannot verify externally hosted URLs, real Kiro evidence, or completed functionality. The Frankenstein integration check requires actual evidence, not the existence of plans. Do not claim it can.');
