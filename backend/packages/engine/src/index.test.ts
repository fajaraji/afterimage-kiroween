import { describe, expect, it } from 'vitest';
import { reduceObservedDeletion } from './index';

describe('bounded deletion observation reducer (no database involved)', () => {
  const stores = ['primary', 'analytics', 'exports'];
  it('returns PASS only when all required stores observed absent', () => {
    expect(reduceObservedDeletion(stores, stores.map((storeId) => ({ storeId, state: 'ABSENT' })))).toBe('PASS');
  });
  it('returns FAIL if any required store is present', () => {
    expect(reduceObservedDeletion(stores, [
      { storeId: 'primary', state: 'ABSENT' },
      { storeId: 'analytics', state: 'PRESENT' },
      { storeId: 'exports', state: 'ABSENT' },
    ])).toBe('FAIL');
  });
  it('never passes on unreachable or missing evidence', () => {
    expect(reduceObservedDeletion(stores, [
      { storeId: 'primary', state: 'ABSENT' },
      { storeId: 'analytics', state: 'ABSENT' },
      { storeId: 'exports', state: 'UNKNOWN' },
    ])).toBe('UNKNOWN');
    expect(reduceObservedDeletion(stores, [{ storeId: 'primary', state: 'ABSENT' }])).toBe('UNKNOWN');
  });
  it('refuses duplicate, unknown and empty required stores', () => {
    expect(reduceObservedDeletion([], [])).toBe('UNKNOWN');
    expect(reduceObservedDeletion(stores, [{ storeId: 'primary', state: 'ABSENT' }, { storeId: 'primary', state: 'ABSENT' }])).toBe('UNKNOWN');
    expect(reduceObservedDeletion(stores, [{ storeId: 'other', state: 'ABSENT' }])).toBe('UNKNOWN');
  });
});
