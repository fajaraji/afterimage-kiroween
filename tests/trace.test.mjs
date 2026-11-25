import test from 'node:test';
import assert from 'node:assert/strict';
import { startDemo, runDemo, evidence } from '../lib/case.ts';
import { openPlayback, replayConfirmedReturn, seedTrace, traceResult } from '../lib/trace.ts';

const initial = startDemo('demo', '2026-11-25T04:00:00Z');
const after = (state, command) =>
  runDemo(
    state,
    command,
    new Date(Date.parse(state.file.startedAt) + (state.file.revision + 1) * 1000).toISOString()
  );
const erased = after(initial, { type: 'erase-primary' });
const scan = after(erased, { type: 'scan' });
const restored = after(scan, { type: 'restore' });

test('intro copy paths describe only a fresh fictional case', () => {
  assert.equal(seedTrace(initial.file, true).targets.length, 3);
  assert.equal(seedTrace(initial.file, false), null);
  assert.equal(seedTrace(erased.file, true), null);
});
test('erase and scan have distinct target sets and leave findings under control of the read', () => {
  const eraseTrace = traceResult(initial.file, erased.file, { type: 'erase-primary' });
  assert.equal(eraseTrace.kind, 'erase');
  assert.deepEqual(eraseTrace.targets, ['primary']);
  assert.equal(evidence(erased.file, 'primary').pendingCheck, true);
  const scanTrace = traceResult(erased.file, scan.file, { type: 'scan' });
  assert.deepEqual(scanTrace.targets, ['primary', 'analytics', 'export', 'backup']);
  assert.match(scanTrace.detail, /3 surviving copies/);
  const single = after(scan, { type: 'inspect', store: 'analytics' });
  assert.deepEqual(traceResult(scan.file, single.file, { type: 'inspect', store: 'analytics' }).targets, [
    'analytics'
  ]);
});
test('resurrection needs a fresh confirming read; a replay does not append evidence', () => {
  const count = restored.file.events.length;
  const trace = traceResult(scan.file, restored.file, { type: 'restore' });
  assert.equal(trace.source, 'backup');
  assert.equal(trace.confirmedReturn, true);
  assert.deepEqual(traceResult(scan.file, restored.file, { type: 'restore' }), trace);
  assert.equal(restored.file.events.length, count);
  const uncertain = structuredClone(restored.file);
  uncertain.events.pop();
  evidence(uncertain, 'primary').finding = 'unreachable';
  assert.equal(traceResult(scan.file, uncertain, { type: 'restore' }).confirmedReturn, false);
  assert.equal(traceResult(restored.file, restored.file, { type: 'restore' }).confirmedReturn, false);
});
test('reopening a restored case offers an idle replay from its recorded source', () => {
  const replay = openPlayback(restored.file, true, 5000);
  assert.equal(replay.trace.source, 'backup');
  assert.equal(replay.trace.confirmedReturn, true);
  assert.equal(replay.at, -Infinity);
  assert.deepEqual(replay.before, []);
});
test('the confirmed scene can be replayed after a later inspection without changing the case', () => {
  const seen = after(restored, { type: 'scan' });
  const prior = structuredClone(seen.file);
  assert.equal(replayConfirmedReturn(seen.file, 27).trace.confirmedReturn, true);
  assert.deepEqual(seen.file, prior);
  const partial = structuredClone(restored.file);
  partial.events.pop();
  assert.equal(replayConfirmedReturn(partial, 27), null);
});
