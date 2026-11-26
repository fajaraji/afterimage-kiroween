import { describe, expect, it } from 'vitest';
import { createInMemoryTestRegistry, InMemoryStoreAdapter } from './memory-stores.js';
import {
  ALLOWLISTED_STORE_IDS,
  assertAllowlistedStoreId,
  assertGeneration,
  assertOpaqueId,
  isAllowlistedStoreId,
  StoreRegistry,
} from './store-adapter.js';

describe('store allowlist and registry', () => {
  it('defines exactly three store IDs', () => {
    expect([...ALLOWLISTED_STORE_IDS]).toEqual(['primary', 'analytics', 'exports']);
  });

  it('rejects unknown and wrong-typed store IDs', () => {
    for (const bad of ['', 'Primary', 'arn:aws:s3:::b', '../x', "primary'; --", 1, null, undefined, {}, ['primary']]) {
      expect(isAllowlistedStoreId(bad)).toBe(false);
      expect(() => assertAllowlistedStoreId(bad)).toThrow();
    }
    expect(() => createInMemoryTestRegistry().get(42 as never)).toThrow();
  });

  it('requires exactly one adapter per allowlisted store', () => {
    const a = new InMemoryStoreAdapter('primary');
    const b = new InMemoryStoreAdapter('analytics');
    expect(() => new StoreRegistry([a, b])).toThrow(/not configured/);
    expect(() => new StoreRegistry([a, a, b])).toThrow(/Duplicate/);
    expect(() => new StoreRegistry([{ storeId: 'rogue' } as never])).toThrow();
    expect(createInMemoryTestRegistry().ids()).toHaveLength(3);
  });

  it('validates ids and generations', () => {
    expect(assertOpaqueId('x', 'run-1')).toBe('run-1');
    for (const bad of ['..', '.', 'a/b', 'a b', 5, '']) expect(() => assertOpaqueId('x', bad)).toThrow();
    expect(assertGeneration(0)).toBe(0);
    for (const bad of [-1, 1.2, '1', NaN, Number.MAX_SAFE_INTEGER + 2]) expect(() => assertGeneration(bad)).toThrow();
  });
});
