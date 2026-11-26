import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseStoreId, parseScenarioId, parseCreateRunRequest, parseStoreObservation,
  parseReplayEvent, parseRunEvidence, STORE_IDS, SCENARIO_IDS,
} from '../dist/index.js';

const hostile = [
  'arn:aws:dynamodb:us-east-1:123456789012:table/prod',
  '../../etc/passwd', 'C:\\Windows\\system32', "primary'; DROP TABLE users;--",
  'primary; rm -rf /', '$(whoami)', '', ' primary', 'PRIMARY', 'exports', 42, null, undefined, {},
];

const obs = { evidenceId: 'obs-001', storeId: 'primary', subjectId: 'synthetic-subject-042', generation: 1, state: 'ABSENT', observedAt: '2026-01-01T00:00:00Z' };
const ev = { eventId: 'evt-1', subjectId: 'synthetic-subject-042', generation: 1, sequence: 1, kind: 'UPSERT' };
const evidence = {
  schemaVersion: '1', runId: 'run-abc123', scenarioId: 'zombie-sync', fixtureHash: 'a'.repeat(64),
  mode: 'protected', status: 'completed', verdict: 'PASS', requiredStores: ['primary', 'analytics', 'export', 'backup'],
  observations: [obs], events: [ev], limitations: ['synthetic only'],
};

test('allowlists are exactly four stores and three scenarios', () => {
  assert.deepEqual([...STORE_IDS], ['primary', 'analytics', 'export', 'backup']);
  assert.deepEqual([...SCENARIO_IDS], ['zombie-sync', 'partial-delete', 'unreachable-store']);
  for (const s of STORE_IDS) assert.equal(parseStoreId(s).ok, true);
  for (const s of SCENARIO_IDS) assert.equal(parseScenarioId(s).ok, true);
});

test('hostile or unknown store and scenario IDs are rejected', () => {
  for (const h of hostile) {
    assert.equal(parseStoreId(h).ok, false, `store ${String(h)}`);
    assert.equal(parseScenarioId(h).ok, false, `scenario ${String(h)}`);
  }
  assert.equal(parseScenarioId('zombie-sync-v1').ok, false);
});

test('create-run request accepts the minimal valid body only', () => {
  const r = parseCreateRunRequest({ scenarioId: 'partial-delete', mode: 'unsafe', seed: 42 });
  assert.equal(r.ok, true);
  for (const bad of [
    { scenarioId: 'partial-delete', mode: 'unsafe', seed: 42, tableArn: 'arn:aws:dynamodb:::table/x' },
    { scenarioId: 'partial-delete', mode: 'unsafe', seed: 42, sql: 'DROP TABLE x' },
    { scenarioId: 'nope', mode: 'unsafe', seed: 42 },
    { scenarioId: 'partial-delete', mode: 'root', seed: 42 },
    { scenarioId: 'partial-delete', mode: 'unsafe', seed: -1 },
    { scenarioId: 'partial-delete', mode: 'unsafe', seed: 1.5 },
    { scenarioId: 'partial-delete', mode: 'unsafe' },
    [], null, 'x',
  ]) assert.equal(parseCreateRunRequest(bad).ok, false, JSON.stringify(bad));
});

test('observation state and assertion verdict stay distinct', () => {
  assert.equal(parseStoreObservation(obs).ok, true);
  assert.equal(parseStoreObservation({ ...obs, state: 'PASS' }).ok, false);
  assert.equal(parseStoreObservation({ ...obs, state: 'UNKNOWN', errorCode: 'Timeout' }).ok, true);
  assert.equal(parseRunEvidence({ ...evidence, verdict: 'PRESENT' }).ok, false);
  assert.equal(parseRunEvidence({ ...evidence, verdict: 'UNKNOWN' }).ok, true);
});

test('observations reject extra fields, bad store, bad ids and bad times', () => {
  assert.equal(parseStoreObservation({ ...obs, path: '/tmp/x' }).ok, false);
  assert.equal(parseStoreObservation({ ...obs, storeId: 'exports' }).ok, false);
  assert.equal(parseStoreObservation({ ...obs, evidenceId: 'arn:aws:s3:::b/k' }).ok, false);
  assert.equal(parseStoreObservation({ ...obs, subjectId: '../x' }).ok, false);
  assert.equal(parseStoreObservation({ ...obs, observedAt: 'yesterday' }).ok, false);
  assert.equal(parseStoreObservation({ ...obs, errorCode: 'a b; ls' }).ok, false);
});

test('events reject unsupported kinds and extra fields', () => {
  assert.equal(parseReplayEvent(ev).ok, true);
  assert.equal(parseReplayEvent({ ...ev, kind: 'EXEC' }).ok, false);
  assert.equal(parseReplayEvent({ ...ev, command: 'ls' }).ok, false);
  assert.equal(parseReplayEvent({ ...ev, sequence: -1 }).ok, false);
});

test('run evidence validates fully and rejects nested extras', () => {
  assert.equal(parseRunEvidence(evidence).ok, true);
  assert.equal(parseRunEvidence({ ...evidence, extra: 1 }).ok, false);
  assert.equal(parseRunEvidence({ ...evidence, scenarioId: 'zombie-sync-v1' }).ok, false);
  assert.equal(parseRunEvidence({ ...evidence, requiredStores: ['primary', 'primary'] }).ok, false);
  assert.equal(parseRunEvidence({ ...evidence, requiredStores: [] }).ok, false);
  assert.equal(parseRunEvidence({ ...evidence, requiredStores: ['arn:aws:s3:::x'] }).ok, false);
  assert.equal(parseRunEvidence({ ...evidence, observations: [{ ...obs, bucketPath: 'x' }] }).ok, false);
  assert.equal(parseRunEvidence({ ...evidence, fixtureHash: 'zz' }).ok, false);
  assert.equal(parseRunEvidence({ ...evidence, schemaVersion: '2' }).ok, false);
  const missing = { ...evidence };
  delete missing.runId;
  assert.equal(parseRunEvidence(missing).ok, false);
});
