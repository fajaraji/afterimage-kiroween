import { describe, expect, it } from 'vitest';
import { createInMemoryTestRegistry, InMemoryStoreAdapter, StoreRegistry } from './memory-stores.js';

describe('in-memory test-fake store adapters (not production evidence)', () => {
  it('creates, observes and deletes', () => {
    const p = createInMemoryTestRegistry().get('primary');
    expect(p.observe('run1', 's1', 1).state).toBe('ABSENT');
    p.create('run1', 's1', 1);
    expect(p.observe('run1', 's1', 1).state).toBe('PRESENT');
    expect(p.observe('run1', 's1', 2).state).toBe('ABSENT');
    p.delete('run1', 's1', 1);
    expect(p.observe('run1', 's1', 1).state).toBe('ABSENT');
    expect(p.isInMemoryTestFake).toBe(true);
  });

  it('keeps stores independent', () => {
    const r = createInMemoryTestRegistry();
    r.get('primary').create('run1', 's1', 1);
    r.get('analytics').create('run1', 's1', 1);
    r.get('primary').delete('run1', 's1', 1);
    expect(r.get('primary').observe('run1', 's1', 1).state).toBe('ABSENT');
    expect(r.get('analytics').observe('run1', 's1', 1).state).toBe('PRESENT');
    expect(r.get('exports').observe('run1', 's1', 1).state).toBe('ABSENT');
  });

  it('isolates runs and resets only one run', () => {
    const a = createInMemoryTestRegistry().get('exports');
    a.create('runA', 's1', 1);
    a.create('runB', 's1', 1);
    expect(a.observe('runC', 's1', 1).state).toBe('ABSENT');
    a.reset('runA');
    expect(a.observe('runA', 's1', 1).state).toBe('ABSENT');
    expect(a.observe('runB', 's1', 1).state).toBe('PRESENT');
  });

  it('returns UNKNOWN, never ABSENT, for an unreachable store', () => {
    const r = createInMemoryTestRegistry(['exports']);
    const o = r.get('exports').observe('run1', 's1', 1);
    expect(o.state).toBe('UNKNOWN');
    expect(o.errorCode).toBe('STORE_UNREACHABLE');
    expect(() => r.get('exports').create('run1', 's1', 1)).toThrow();
    expect(r.get('primary').observe('run1', 's1', 1).state).toBe('ABSENT');
  });

  it('rejects non-allowlisted store IDs and malformed inputs', () => {
    const r = createInMemoryTestRegistry();
    expect(() => r.get('arn:aws:dynamodb:::table/x')).toThrow();
    expect(() => r.get('../etc')).toThrow();
    expect(() => r.get('')).toThrow();
    expect(() => new InMemoryStoreAdapter('bogus' as never)).toThrow();
    expect(() => new StoreRegistry([r.get('primary'), r.get('primary')])).toThrow();
    const p = r.get('primary');
    expect(() => p.create("run1'; DROP", 's1', 1)).toThrow();
    expect(() => p.observe('run1', 's1', -1)).toThrow();
    expect(() => p.observe('run1', 's1', 1.5)).toThrow();
  });
});
