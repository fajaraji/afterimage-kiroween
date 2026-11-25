import test from 'node:test';
import assert from 'node:assert/strict';
import { canRestore, evidence, isCaseFile, outcome, runDemo, startDemo } from '../lib/case.ts';

const at = '2026-11-25T00:00:00.000Z';
const open = () => startDemo('fictional-1', at);
const act = (state, type, store) => runDemo(state, store ? { type, store } : { type }, new Date(Date.parse(at) + (state.file.revision + 1) * 1000).toISOString());
const scanAfterErasure = () => act(act(open(), 'erase-primary'), 'scan');

test('a fresh case treats every seed as unverified and refuses early restores', () => {
  const state = open();
  assert.ok(isCaseFile(state.file));
  assert.ok(state.file.stores.every(item => outcome(item) === 'unverified'));
  assert.throws(() => act(state, 'restore'));
  assert.throws(() => act(state, 'scan'));
});

test('removal never certifies absence until a subsequent read', () => {
  const initial = open();
  const requested = act(initial, 'erase-primary');
  assert.equal(outcome(evidence(requested.file,'primary')), 'unverified');
  const scanned = act(requested, 'scan');
  assert.equal(outcome(evidence(scanned.file,'primary')), 'clear');
  assert.equal(scanned.file.stores.filter(s => outcome(s) === 'found').length, 3);
  const removed = act(scanned, 'erase-copy', 'analytics');
  const pending = evidence(removed.file,'analytics');
  assert.equal(pending.finding,'found');
  assert.equal(outcome(pending),'unverified');
  assert.equal(removed.copies.analytics,false);
  assert.equal(initial.copies.analytics,true);
  const confirmed = act(removed,'inspect','analytics');
  assert.equal(outcome(evidence(confirmed.file,'analytics')),'clear');
  assert.notEqual(evidence(confirmed.file,'analytics').checkedAt,pending.checkedAt);
});

test('restoring a retained snapshot records lineage and a new primary read', () => {
  let state = scanAfterErasure();
  for (const store of ['analytics','export']) state = act(act(state,'erase-copy',store),'inspect',store);
  assert.equal(canRestore(state.file), true);
  const restored = act(state,'restore');
  const primary = evidence(restored.file,'primary');
  assert.equal(restored.copies.primary,true);
  assert.equal(primary.finding,'returned');
  assert.equal(primary.sourceId,'backup');
  assert.deepEqual(restored.file.events.slice(-2).map(e => e.kind),['restore','return']);
  assert.equal(primary.checkedAt, restored.file.events.at(-1).at);
  assert.throws(() => act(restored,'restore'));
  assert.equal(evidence(act(restored,'scan').file,'primary').finding,'returned');
  assert.equal(isCaseFile(restored.file),true);
});

test('erasing the last backup prevents a resurrection and supports four clear results', () => {
  let state = scanAfterErasure();
  for (const store of ['backup','analytics','export']) state = act(act(state,'erase-copy',store),'inspect',store);
  assert.equal(canRestore(state.file),false);
  assert.throws(() => act(state,'restore'));
  assert.ok(state.file.stores.every(s => outcome(s) === 'clear'));
});

test('out-of-scope evidence stays unverified; malformed snapshots cannot certify erasure', () => {
  const state = open();
  const copy = evidence(state.file,'export');
  copy.finding = 'unreachable';
  assert.equal(isCaseFile(state.file),true);
  assert.equal(outcome(copy),'unverified');
  copy.finding = 'clear';
  assert.equal(isCaseFile(state.file),false);
  copy.checkedAt = at;
  assert.equal(isCaseFile(state.file),true);
  state.file.stores[0].id = 'backup';
  assert.equal(isCaseFile(state.file),false);
});

test('a fresh visitor or reset starts with an independent set of physical copies and events', () => {
  const first = scanAfterErasure();
  const second = open();
  assert.equal(second.file.revision,0);
  assert.equal(second.file.events.length,1);
  assert.equal(second.copies.primary,true);
  assert.equal(first.copies.primary,false);
});
