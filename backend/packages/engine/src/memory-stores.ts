/**
 * IN-MEMORY TEST FAKES. These adapters exist only to exercise create/delete/observe
 * logic locally. They are NOT production evidence, deploy nothing, and never prove
 * deletion in any real store. Real AWS adapters belong to spec 06.
 *
 * Adapters accept no ARNs, keys, paths or SQL: only allowlisted store IDs, a runId,
 * a subjectId and a generation.
 */
import {
  ALLOWLISTED_STORE_IDS,
  assertAllowlistedStoreId,
  assertGeneration,
  assertOpaqueId,
  StoreRegistry,
  type AllowlistedStoreId,
  type StoreAdapter,
  type StoreObserveResult,
} from './store-adapter.js';

export { ALLOWLISTED_STORE_IDS, StoreRegistry };
export type { AllowlistedStoreId, StoreAdapter, StoreObserveResult };
export type { StoreObservationState } from './store-adapter.js';

/** Test-fake extension: adds create so tests can seed data. Production adapters do not need it. */
export interface InMemoryTestAdapter extends StoreAdapter {
  readonly isInMemoryTestFake: true;
  create(runId: string, subjectId: string, generation: number): void;
}
export class InMemoryStoreAdapter implements InMemoryTestAdapter {
  readonly isInMemoryTestFake = true as const;
  private readonly data = new Map<string, Set<string>>();
  private unreachable: boolean;

  constructor(
    readonly storeId: AllowlistedStoreId,
    options: { unreachable?: boolean } = {},
  ) {
    assertAllowlistedStoreId(storeId);
    this.unreachable = options.unreachable === true;
  }

  /** Test-harness switch: an unreachable store can only ever observe UNKNOWN. */
  setUnreachable(value: boolean): void {
    this.unreachable = value;
  }

  reset(runId: string): void {
    assertOpaqueId('runId', runId);
    this.data.delete(runId);
  }

  create(runId: string, subjectId: string, generation: number): void {
    this.assertWritable(runId, subjectId, generation);
    let run = this.data.get(runId);
    if (!run) {
      run = new Set();
      this.data.set(runId, run);
    }
    run.add(`${subjectId}#${generation}`);
  }

  delete(runId: string, subjectId: string, generation: number): void {
    this.assertWritable(runId, subjectId, generation);
    this.data.get(runId)?.delete(`${subjectId}#${generation}`);
  }

  observe(runId: string, subjectId: string, generation: number): StoreObserveResult {
    assertOpaqueId('runId', runId);
    assertOpaqueId('subjectId', subjectId);
    assertGeneration(generation);
    const base = { storeId: this.storeId, runId, subjectId, generation };
    if (this.unreachable) return { ...base, state: 'UNKNOWN', errorCode: 'STORE_UNREACHABLE' };
    const present = this.data.get(runId)?.has(`${subjectId}#${generation}`) === true;
    return { ...base, state: present ? 'PRESENT' : 'ABSENT' };
  }

  private assertWritable(runId: string, subjectId: string, generation: number): void {
    assertOpaqueId('runId', runId);
    assertOpaqueId('subjectId', subjectId);
    assertGeneration(generation);
    if (this.unreachable) throw new Error('STORE_UNREACHABLE');
  }
}

/** Builds the four independent in-memory test fakes. */
export function createInMemoryTestRegistry(unreachable: readonly AllowlistedStoreId[] = []): StoreRegistry<InMemoryStoreAdapter> {
  return new StoreRegistry<InMemoryStoreAdapter>(
    ALLOWLISTED_STORE_IDS.map((id) => new InMemoryStoreAdapter(id, { unreachable: unreachable.includes(id) })),
  );
}
