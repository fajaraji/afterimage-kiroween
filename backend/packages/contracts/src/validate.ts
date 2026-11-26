/**
 * Strict runtime parsers for untrusted JSON. Pure, dependency-free.
 * Allowlists are the only way an ID can become a StoreId or ScenarioId; no value is ever
 * used as an ARN, path, query or command.
 */

export const STORE_IDS = ['primary', 'analytics', 'exports'] as const;
export const SCENARIO_IDS = ['zombie-sync', 'partial-delete', 'unreachable-store'] as const;
export const CONSUMER_MODES = ['unsafe', 'protected'] as const;
export const OBSERVATION_STATES = ['PRESENT', 'ABSENT', 'UNKNOWN'] as const;
export const ASSERTION_VERDICTS = ['PASS', 'FAIL', 'UNKNOWN'] as const;
export const RUN_STATUSES = ['queued', 'running', 'completed', 'failed'] as const;
export const EVENT_KINDS = ['CREATE', 'UPSERT', 'DELETE', 'HOLD', 'RELEASE'] as const;

export type StoreAllow = (typeof STORE_IDS)[number];
export type ScenarioId = (typeof SCENARIO_IDS)[number];
export type ParsedConsumerMode = (typeof CONSUMER_MODES)[number];

export type ParseResult<T> = { ok: true; value: T } | { ok: false; errors: string[] };

/** Opaque synthetic identifier: no ':' (ARNs), '/' '\\' '.' sequences (paths), spaces, quotes, ';' or '$' (SQL/shell). */
const OPAQUE_ID = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
const ISO_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/;
const FIXTURE_HASH = /^[a-f0-9]{64}$/;
const ERROR_CODE = /^[A-Za-z0-9_.-]{1,64}$/;

type Rec = Record<string, unknown>;

function isRec(v: unknown): v is Rec {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function fail<T>(errors: string[]): ParseResult<T> {
  return { ok: false, errors };
}

function checkKeys(o: Rec, required: readonly string[], optional: readonly string[], errs: string[], at: string): void {
  for (const k of Object.keys(o)) {
    if (!required.includes(k) && !optional.includes(k)) errs.push(`${at}.${k}: unknown field`);
  }
  for (const k of required) if (!(k in o)) errs.push(`${at}.${k}: required`);
}

function oneOf<T extends string>(v: unknown, allowed: readonly T[]): v is T {
  return typeof v === 'string' && (allowed as readonly string[]).includes(v);
}

function opaqueId(v: unknown): v is string {
  return typeof v === 'string' && OPAQUE_ID.test(v);
}

function isoTime(v: unknown): v is string {
  return typeof v === 'string' && ISO_UTC.test(v) && !Number.isNaN(Date.parse(v));
}

function nonNegInt(v: unknown): v is number {
  return typeof v === 'number' && Number.isSafeInteger(v) && v >= 0;
}

export function parseStoreId(v: unknown): ParseResult<StoreAllow> {
  return oneOf(v, STORE_IDS) ? { ok: true, value: v } : fail(['storeId: not on allowlist']);
}

export function parseScenarioId(v: unknown): ParseResult<ScenarioId> {
  return oneOf(v, SCENARIO_IDS) ? { ok: true, value: v } : fail(['scenarioId: not on allowlist']);
}

export interface CreateRunRequest {
  scenarioId: ScenarioId;
  mode: ParsedConsumerMode;
  seed: number;
}

/** POST /api/runs body. Only scenarioId, mode and seed are accepted. */
export function parseCreateRunRequest(v: unknown): ParseResult<CreateRunRequest> {
  if (!isRec(v)) return fail(['body: must be an object']);
  const errs: string[] = [];
  checkKeys(v, ['scenarioId', 'mode', 'seed'], [], errs, 'body');
  if ('scenarioId' in v && !oneOf(v.scenarioId, SCENARIO_IDS)) errs.push('body.scenarioId: not on allowlist');
  if ('mode' in v && !oneOf(v.mode, CONSUMER_MODES)) errs.push('body.mode: not on allowlist');
  if ('seed' in v && !(nonNegInt(v.seed) && v.seed <= 1_000_000)) errs.push('body.seed: must be integer 0..1000000');
  if (errs.length) return fail(errs);
  return { ok: true, value: { scenarioId: v.scenarioId as ScenarioId, mode: v.mode as ParsedConsumerMode, seed: v.seed as number } };
}

export interface ParsedStoreObservation {
  evidenceId: string;
  storeId: StoreAllow;
  subjectId: string;
  generation: number;
  state: (typeof OBSERVATION_STATES)[number];
  observedAt: string;
  errorCode?: string;
}

function observationErrors(v: Rec, at: string): string[] {
  const errs: string[] = [];
  checkKeys(v, ['evidenceId', 'storeId', 'subjectId', 'generation', 'state', 'observedAt'], ['errorCode'], errs, at);
  if ('evidenceId' in v && !opaqueId(v.evidenceId)) errs.push(`${at}.evidenceId: invalid id`);
  if ('storeId' in v && !oneOf(v.storeId, STORE_IDS)) errs.push(`${at}.storeId: not on allowlist`);
  if ('subjectId' in v && !opaqueId(v.subjectId)) errs.push(`${at}.subjectId: invalid id`);
  if ('generation' in v && !nonNegInt(v.generation)) errs.push(`${at}.generation: must be non-negative integer`);
  // ObservationState is distinct from AssertionVerdict: PASS/FAIL are rejected here.
  if ('state' in v && !oneOf(v.state, OBSERVATION_STATES)) errs.push(`${at}.state: must be PRESENT, ABSENT or UNKNOWN`);
  if ('observedAt' in v && !isoTime(v.observedAt)) errs.push(`${at}.observedAt: must be ISO-8601 UTC`);
  if ('errorCode' in v && !(typeof v.errorCode === 'string' && ERROR_CODE.test(v.errorCode))) errs.push(`${at}.errorCode: invalid code`);
  return errs;
}

export function parseStoreObservation(v: unknown): ParseResult<ParsedStoreObservation> {
  if (!isRec(v)) return fail(['observation: must be an object']);
  const errs = observationErrors(v, 'observation');
  return errs.length ? fail(errs) : { ok: true, value: v as unknown as ParsedStoreObservation };
}

export interface ParsedReplayEvent {
  eventId: string;
  subjectId: string;
  generation: number;
  sequence: number;
  kind: (typeof EVENT_KINDS)[number];
}

function eventErrors(v: Rec, at: string): string[] {
  const errs: string[] = [];
  checkKeys(v, ['eventId', 'subjectId', 'generation', 'sequence', 'kind'], [], errs, at);
  if ('eventId' in v && !opaqueId(v.eventId)) errs.push(`${at}.eventId: invalid id`);
  if ('subjectId' in v && !opaqueId(v.subjectId)) errs.push(`${at}.subjectId: invalid id`);
  if ('generation' in v && !nonNegInt(v.generation)) errs.push(`${at}.generation: must be non-negative integer`);
  if ('sequence' in v && !nonNegInt(v.sequence)) errs.push(`${at}.sequence: must be non-negative integer`);
  if ('kind' in v && !oneOf(v.kind, EVENT_KINDS)) errs.push(`${at}.kind: unsupported event kind`);
  return errs;
}

export function parseReplayEvent(v: unknown): ParseResult<ParsedReplayEvent> {
  if (!isRec(v)) return fail(['event: must be an object']);
  const errs = eventErrors(v, 'event');
  return errs.length ? fail(errs) : { ok: true, value: v as unknown as ParsedReplayEvent };
}

export interface ParsedRunEvidence {
  schemaVersion: '1';
  runId: string;
  scenarioId: ScenarioId;
  fixtureHash: string;
  mode: ParsedConsumerMode;
  status: (typeof RUN_STATUSES)[number];
  verdict: (typeof ASSERTION_VERDICTS)[number];
  requiredStores: StoreAllow[];
  observations: ParsedStoreObservation[];
  events: ParsedReplayEvent[];
  limitations: string[];
}

export function parseRunEvidence(v: unknown): ParseResult<ParsedRunEvidence> {
  if (!isRec(v)) return fail(['evidence: must be an object']);
  const errs: string[] = [];
  const at = 'evidence';
  checkKeys(v, ['schemaVersion', 'runId', 'scenarioId', 'fixtureHash', 'mode', 'status', 'verdict', 'requiredStores', 'observations', 'events', 'limitations'], [], errs, at);
  if ('schemaVersion' in v && v.schemaVersion !== '1') errs.push(`${at}.schemaVersion: unsupported`);
  if ('runId' in v && !opaqueId(v.runId)) errs.push(`${at}.runId: invalid id`);
  if ('scenarioId' in v && !oneOf(v.scenarioId, SCENARIO_IDS)) errs.push(`${at}.scenarioId: not on allowlist`);
  if ('fixtureHash' in v && !(typeof v.fixtureHash === 'string' && FIXTURE_HASH.test(v.fixtureHash))) errs.push(`${at}.fixtureHash: must be 64 hex chars`);
  if ('mode' in v && !oneOf(v.mode, CONSUMER_MODES)) errs.push(`${at}.mode: not on allowlist`);
  if ('status' in v && !oneOf(v.status, RUN_STATUSES)) errs.push(`${at}.status: invalid`);
  if ('verdict' in v && !oneOf(v.verdict, ASSERTION_VERDICTS)) errs.push(`${at}.verdict: must be PASS, FAIL or UNKNOWN`);
  if ('requiredStores' in v) {
    const rs = v.requiredStores;
    if (!Array.isArray(rs) || rs.length === 0 || rs.length > STORE_IDS.length) errs.push(`${at}.requiredStores: must be 1..${STORE_IDS.length} items`);
    else {
      rs.forEach((s, i) => { if (!oneOf(s, STORE_IDS)) errs.push(`${at}.requiredStores[${i}]: not on allowlist`); });
      if (new Set(rs).size !== rs.length) errs.push(`${at}.requiredStores: duplicates`);
    }
  }
  if ('observations' in v) {
    if (!Array.isArray(v.observations) || v.observations.length > 100) errs.push(`${at}.observations: must be array (max 100)`);
    else v.observations.forEach((o, i) => errs.push(...(isRec(o) ? observationErrors(o, `${at}.observations[${i}]`) : [`${at}.observations[${i}]: must be an object`])));
  }
  if ('events' in v) {
    if (!Array.isArray(v.events) || v.events.length > 100) errs.push(`${at}.events: must be array (max 100)`);
    else v.events.forEach((e, i) => errs.push(...(isRec(e) ? eventErrors(e, `${at}.events[${i}]`) : [`${at}.events[${i}]: must be an object`])));
  }
  if ('limitations' in v && !(Array.isArray(v.limitations) && v.limitations.length <= 20 && v.limitations.every((s) => typeof s === 'string' && s.length <= 500))) {
    errs.push(`${at}.limitations: must be array of short strings`);
  }
  return errs.length ? fail(errs) : { ok: true, value: v as unknown as ParsedRunEvidence };
}
