import test from 'node:test';
import assert from 'node:assert/strict';
import { evidence, outcome, runDemo, startDemo } from '../lib/case.ts';
import { nextStep, restoreRoute } from '../lib/investigation.ts';
import { compareRestoreReads } from '../lib/restore-evidence.ts';
import { traceResult } from '../lib/trace.ts';

const newCase = () => startDemo('direct', '2026-11-25T10:00:00Z');
const apply = (state, command) =>
  runDemo(
    state,
    command,
    new Date(Date.parse(state.file.startedAt) + (state.file.revision + 1) * 1000).toISOString()
  );
const scan = () => apply(apply(newCase(), { type: 'erase-primary' }), { type: 'scan' });
const restore = (scanned) => apply(scanned, { type: 'restore' });

test('one action takes a new visitor through erasure, all four reads, restore and certificate', () => {
  let state = newCase();
  for (const [index, type] of ['erase-primary', 'scan', 'restore'].entries()) {
    const step = nextStep(state.file);
    assert.equal(step.number, index + 1);
    assert.equal(step.command.type, type);
    state = apply(state, step.command);
  }
  assert.equal(nextStep(state.file).number, 4);
  assert.equal(nextStep(state.file).label, 'View certificate');
  assert.equal(nextStep(state.file).command, undefined);
  assert.deepEqual(state.file.stores.map(outcome), ['found', 'found', 'found', 'found']);
  assert.deepEqual(
    state.file.events.slice(-2).map((event) => [event.kind, event.store]),
    [
      ['restore', 'backup'],
      ['return', 'primary']
    ]
  );
});

test('the path changes from possible to confirmed and clears when evidence changes', () => {
  const scanned = scan();
  assert.equal(restoreRoute(newCase().file), null);
  assert.deepEqual(restoreRoute(scanned.file), { kind: 'possible', source: 'backup' });
  const restored = restore(scanned);
  assert.deepEqual(restoreRoute(restored.file), { kind: 'confirmed', source: 'backup' });
  const erased = apply(restored, { type: 'erase-copy', store: 'primary' });
  assert.equal(restoreRoute(erased.file), null);
  assert.equal(nextStep(erased.file).command.type, 'inspect');
  const checked = apply(erased, { type: 'inspect', store: 'primary' });
  assert.deepEqual(restoreRoute(checked.file), { kind: 'possible', source: 'backup' });
  assert.doesNotMatch(nextStep(checked.file).hint, /found the record back/);
  assert.equal(restoreRoute(apply(scanned, { type: 'erase-copy', store: 'backup' }).file), null);
});

test('an acknowledgement, a misordered read or a mismatched source cannot confirm a route', () => {
  const scanned = scan();
  const original = restore(scanned).file;
  for (const change of [
    (file) => {
      file.events.pop();
      evidence(file, 'primary').finding = 'clear';
    },
    (file) => {
      evidence(file, 'primary').finding = 'unreachable';
    },
    (file) => {
      evidence(file, 'primary').pendingCheck = true;
    },
    (file) => {
      file.events.at(-2).store = 'export';
    },
    (file) => {
      file.events.at(-1).seq = file.events.at(-2).seq - 1;
    }
  ]) {
    const file = structuredClone(original);
    change(file);
    assert.equal(restoreRoute(file), null);
    assert.equal(traceResult(scanned.file, file, { type: 'restore' }).confirmedReturn, false);
    assert.notEqual(nextStep(file).command?.type, 'restore');
  }
});

test('the report shows the two actual reads around an import, including legacy v1 events', () => {
  const scanned = scan();
  assert.equal(compareRestoreReads(scanned.file), null);
  const restored = restore(scanned);
  const comparison = compareRestoreReads(restored.file);
  assert.equal(comparison.before.store, 'primary');
  assert.match(comparison.before.detail, /no matching/);
  assert.equal(comparison.after.kind, 'return');
  assert.ok(
    comparison.before.seq < comparison.imported.seq && comparison.imported.seq < comparison.after.seq
  );
  const partial = structuredClone(restored.file);
  partial.events.pop();
  assert.equal(compareRestoreReads(partial).after, undefined);
  const erased = apply(restored, { type: 'erase-copy', store: 'primary' });
  const checked = apply(erased, { type: 'inspect', store: 'primary' });
  assert.deepEqual(compareRestoreReads(checked.file).after, comparison.after);
  const second = restore(checked);
  assert.equal(compareRestoreReads(second.file).before.seq, checked.file.events.at(-1).seq);
});

test('an earlier or later read is never substituted for missing evidence', () => {
  const file = restore(scan()).file;
  const imported = file.events.at(-2);
  file.events = [
    file.events[0],
    imported,
    { ...imported, seq: imported.seq + 1, kind: 'erasure', store: 'primary' },
    { ...imported, seq: imported.seq + 2, kind: 'inspection', store: 'primary' }
  ];
  const comparison = compareRestoreReads(file);
  assert.equal(comparison.before, undefined);
  assert.equal(comparison.after, undefined);
});
