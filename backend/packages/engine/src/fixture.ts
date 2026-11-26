/**
 * Seeded synthetic fixture initialization/reset and deterministic fixture hash (spec 01 task 4).
 *
 * Pure and deterministic: subject IDs derive from the seed via SHA-256, timestamps are
 * logical sequence numbers (no wall clock), and the hash excludes runId so repeated runs
 * of the same seed produce the same hash. Subjects carry no personal identity fields.
 * Initialization and reset return an explicit error result and never a verdict.
 * Used with in-memory test fakes locally; this is not AWS evidence.
 */
import { createHash } from 'node:crypto';
import { ALLOWLISTED_STORE_IDS, assertOpaqueId, type StoreRegistry } from './store-adapter.js';
import type { InMemoryTestAdapter } from './memory-stores.js';

export const FIXTURE_VERSION = 'nocturne-v1';
export const DEFAULT_SUBJECT_COUNT = 3;
const MAX_SUBJECTS = 16;

export interface FixtureSubject {
  subjectId: string;
  generation: number;
  /** Logical sequence number, not wall-clock time. */
  createdAtSequence: number;
}

export interface Fixture {
  fixtureVersion: string;
  seed: string;
  subjects: readonly FixtureSubject[];
  /** SHA-256 hex over the canonical fixture (excludes runId). */
  fixtureHash: string;
}

export type FixtureErrorCode = 'INVALID_INPUT' | 'RESET_FAILED' | 'INIT_FAILED';
export interface FixtureError {
  ok: false;
  code: FixtureErrorCode;
  message: string;
  storeId?: string;
}
export type FixtureResult = { ok: true; runId: string; fixture: Fixture } | FixtureError;

function sha256(text: string): string {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

/** Builds the fixture for a seed without touching any store. Throws on invalid input. */
export function buildFixture(seed: string, subjectCount: number = DEFAULT_SUBJECT_COUNT): Fixture {
  assertOpaqueId('seed', seed);
  if (!Number.isSafeInteger(subjectCount) || subjectCount < 1 || subjectCount > MAX_SUBJECTS) {
    throw new Error('Invalid subjectCount');
  }
  const subjects: FixtureSubject[] = [];
  for (let i = 0; i < subjectCount; i++) {
    subjects.push({
      subjectId: `subj-${sha256(`${FIXTURE_VERSION}:${seed}:${i}`).slice(0, 16)}`,
      generation: 1,
      createdAtSequence: i + 1,
    });
  }
  const canonical = JSON.stringify({ fixtureVersion: FIXTURE_VERSION, seed, subjects });
  return { fixtureVersion: FIXTURE_VERSION, seed, subjects, fixtureHash: sha256(canonical) };
}

export function computeFixtureHash(seed: string, subjectCount: number = DEFAULT_SUBJECT_COUNT): string {
  return buildFixture(seed, subjectCount).fixtureHash;
}

function fail(code: FixtureErrorCode, err: unknown, storeId?: string): FixtureError {
  const message = err instanceof Error ? err.message : 'Unknown error';
  return storeId ? { ok: false, code, message, storeId } : { ok: false, code, message };
}

export class FixtureRepository {
  constructor(
    private readonly registry: StoreRegistry<InMemoryTestAdapter>,
    private readonly subjectCount: number = DEFAULT_SUBJECT_COUNT,
  ) {}

  /** Resets every store for the run, then seeds the fixture subjects into every store. */
  async create(runId: string, seed: string): Promise<FixtureResult> {
    let fixture: Fixture;
    try {
      assertOpaqueId('runId', runId);
      fixture = buildFixture(seed, this.subjectCount);
    } catch (err) {
      return fail('INVALID_INPUT', err);
    }
    const reset = await this.reset(runId);
    if (!reset.ok) return reset;
    for (const storeId of ALLOWLISTED_STORE_IDS) {
      try {
        const adapter = this.registry.get(storeId);
        for (const s of fixture.subjects) await adapter.create(runId, s.subjectId, s.generation);
      } catch (err) {
        return fail('INIT_FAILED', err, storeId);
      }
    }
    return { ok: true, runId, fixture };
  }

  /** Resets all stores for one run. Returns an explicit error if any store fails. */
  async reset(runId: string): Promise<{ ok: true } | FixtureError> {
    try {
      assertOpaqueId('runId', runId);
    } catch (err) {
      return fail('INVALID_INPUT', err);
    }
    for (const storeId of ALLOWLISTED_STORE_IDS) {
      try {
        await this.registry.get(storeId).reset(runId);
      } catch (err) {
        return fail('RESET_FAILED', err, storeId);
      }
    }
    return { ok: true };
  }
}
