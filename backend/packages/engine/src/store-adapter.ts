/**
 * Store adapter contract and allowlisted store IDs (spec 01 task 3).
 *
 * Interfaces only plus pure validation. No AWS code lives here: real DynamoDB/S3
 * adapters belong to spec 06. Adapters accept no ARNs, keys, paths, SQL or commands;
 * only an allowlisted store ID (chosen at construction), a runId, a subjectId and a
 * generation. Each store is independently queryable; `observe` is a direct read and
 * must return UNKNOWN (never ABSENT) when the store cannot be read.
 */
export const ALLOWLISTED_STORE_IDS = ['primary', 'analytics', 'exports'] as const;
export type AllowlistedStoreId = (typeof ALLOWLISTED_STORE_IDS)[number];
export type StoreObservationState = 'PRESENT' | 'ABSENT' | 'UNKNOWN';

export interface StoreObserveResult {
  storeId: AllowlistedStoreId;
  runId: string;
  subjectId: string;
  generation: number;
  state: StoreObservationState;
  errorCode?: string;
}

export interface StoreAdapter {
  readonly storeId: AllowlistedStoreId;
  /** Removes all data for one run only. */
  reset(runId: string): void | Promise<void>;
  /** Deletes one synthetic subject generation within a run. */
  delete(runId: string, subjectId: string, generation: number): void | Promise<void>;
  /** Direct, independent read of the store. UNKNOWN when it cannot be read. */
  observe(runId: string, subjectId: string, generation: number): StoreObserveResult | Promise<StoreObserveResult>;
}

const ID_PATTERN = /^[A-Za-z0-9._-]{1,64}$/;

export function isAllowlistedStoreId(value: unknown): value is AllowlistedStoreId {
  return typeof value === 'string' && (ALLOWLISTED_STORE_IDS as readonly string[]).includes(value);
}

export function assertAllowlistedStoreId(value: unknown): AllowlistedStoreId {
  if (!isAllowlistedStoreId(value)) throw new Error('Store not allowlisted');
  return value;
}

export function assertOpaqueId(label: string, value: unknown): string {
  if (typeof value !== 'string' || !ID_PATTERN.test(value) || value === '.' || value === '..') {
    throw new Error(`Invalid ${label}`);
  }
  return value;
}

export function assertGeneration(value: unknown): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0) throw new Error('Invalid generation');
  return value;
}

/**
 * Holds exactly one adapter for each allowlisted store. `get` accepts only allowlisted
 * IDs, so a caller-supplied string can never select an arbitrary resource.
 */
export class StoreRegistry<A extends StoreAdapter = StoreAdapter> {
  private readonly adapters = new Map<AllowlistedStoreId, A>();

  constructor(adapters: readonly A[]) {
    for (const a of adapters) {
      const id = assertAllowlistedStoreId(a?.storeId);
      if (this.adapters.has(id)) throw new Error(`Duplicate store: ${id}`);
      this.adapters.set(id, a);
    }
    for (const id of ALLOWLISTED_STORE_IDS) {
      if (!this.adapters.has(id)) throw new Error(`Store not configured: ${id}`);
    }
  }

  get(storeId: string): A {
    const adapter = this.adapters.get(assertAllowlistedStoreId(storeId));
    if (!adapter) throw new Error(`Store not configured: ${storeId}`);
    return adapter;
  }

  ids(): readonly AllowlistedStoreId[] {
    return ALLOWLISTED_STORE_IDS;
  }
}
