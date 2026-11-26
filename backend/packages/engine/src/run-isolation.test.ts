import { describe, expect, it } from 'vitest';
import { FixtureRepository } from './fixture.js';
import { createInMemoryTestRegistry, InMemoryStoreAdapter, StoreRegistry } from './memory-stores.js';
import { ALLOWLISTED_STORE_IDS } from './store-adapter.js';

// Local in-memory fakes only; not AWS evidence. Covers FOUNDATION-3, 4, 5.

describe('run isolation (FOUNDATION-4)', () => {
  it('seeding or resetting one run never changes another run in any store', async () => {
    const registry = createInMemoryTestRegistry();
    const repo = new FixtureRepository(registry);
    const a = await repo.create('runA', 'seed-a');
    const b = await repo.create('runB', 'seed-b');
    if (!a.ok || !b.ok) throw new Error('expected ok');

    // Each run only sees its own subjects.
    for (const id of ALLOWLISTED_STORE_IDS) {
      const store = registry.get(id);
      for (const s of a.fixture.subjects) {
        expect(store.observe('runA', s.subjectId, 1).state).toBe('PRESENT');
        expect(store.observe('runB', s.subjectId, 1).state).toBe('ABSENT');
      }
      for (const s of b.fixture.subjects) {
        expect(store.observe('runB', s.subjectId, 1).state).toBe('PRESENT');
        expect(store.observe('runA', s.subjectId, 1).state).toBe('ABSENT');
      }
    }

    // Reset and delete on run A leave run B untouched.
    registry.get('primary').delete('runA', a.fixture.subjects[0]!.subjectId, 1);
    expect((await repo.reset('runA')).ok).toBe(true);
    for (const id of ALLOWLISTED_STORE_IDS) {
      for (const s of b.fixture.subjects) expect(registry.get(id).observe('runB', s.subjectId, 1).state).toBe('PRESENT');
    }
  });

  it('same seed in two runs yields the same fixture but independent state', async () => {
    const registry = createInMemoryTestRegistry();
    const repo = new FixtureRepository(registry);
    const a = await repo.create('runA', 'shared-seed');
    const b = await repo.create('runB', 'shared-seed');
    if (!a.ok || !b.ok) throw new Error('expected ok');
    expect(a.fixture).toEqual(b.fixture);
    const s = a.fixture.subjects[0]!;
    registry.get('analytics').delete('runA', s.subjectId, 1);
    expect(registry.get('analytics').observe('runA', s.subjectId, 1).state).toBe('ABSENT');
    expect(registry.get('analytics').observe('runB', s.subjectId, 1).state).toBe('PRESENT');
  });

  it('a failed create for one run does not leak partial data into another run', async () => {
    const registry = createInMemoryTestRegistry();
    const repo = new FixtureRepository(registry);
    const ok = await repo.create('runA', 'seed-a');
    if (!ok.ok) throw new Error('expected ok');
    registry.get('export').setUnreachable(true);
    const failed = await repo.create('runB', 'seed-b');
    expect(failed).toMatchObject({ ok: false, code: 'INIT_FAILED', storeId: 'export' });
    registry.get('export').setUnreachable(false);
    for (const s of ok.fixture.subjects) {
      expect(registry.get('export').observe('runA', s.subjectId, 1).state).toBe('PRESENT');
    }
  });
});

describe('failed init/reset returns explicit error, never a verdict (FOUNDATION-5)', () => {
  function registryWithFailingReset(mode: 'sync' | 'async') {
    const failing = new InMemoryStoreAdapter('analytics');
    failing.reset = (() => {
      if (mode === 'sync') throw new Error('reset boom');
      return Promise.reject(new Error('reset boom'));
    }) as InMemoryStoreAdapter['reset'];
    return new StoreRegistry<InMemoryStoreAdapter>([
      new InMemoryStoreAdapter('primary'),
      failing,
      new InMemoryStoreAdapter('export'),
      new InMemoryStoreAdapter('backup'),
    ]);
  }

  for (const mode of ['sync', 'async'] as const) {
    it(`create() reports RESET_FAILED (${mode} failure) and seeds nothing`, async () => {
      const registry = registryWithFailingReset(mode);
      const res = await new FixtureRepository(registry).create('run1', 'seed-a');
      expect(res).toMatchObject({ ok: false, code: 'RESET_FAILED', storeId: 'analytics' });
      for (const key of ['verdict', 'fixture', 'runId', 'status']) expect(res).not.toHaveProperty(key);
      for (const id of ALLOWLISTED_STORE_IDS) {
        expect(registry.get(id).observe('run1', 'anything', 1).state).not.toBe('PRESENT');
      }
    });

    it(`reset() reports RESET_FAILED (${mode} failure) as an error result`, async () => {
      const res = await new FixtureRepository(registryWithFailingReset(mode)).reset('run1');
      expect(res).toMatchObject({ ok: false, code: 'RESET_FAILED', storeId: 'analytics' });
      expect(res).not.toHaveProperty('verdict');
    });
  }

  it('a failed init never carries a verdict or fixture, and seeding stops at the failing store', async () => {
    const registry = createInMemoryTestRegistry(['analytics']);
    const res = await new FixtureRepository(registry).create('run1', 'seed-a');
    expect(res).toMatchObject({ ok: false, code: 'INIT_FAILED', storeId: 'analytics' });
    expect(res).not.toHaveProperty('verdict');
    expect(res).not.toHaveProperty('fixture');
    // Unreachable store is UNKNOWN, never ABSENT/PASS-like.
    expect(registry.get('analytics').observe('run1', 'x', 1).state).toBe('UNKNOWN');
  });

  it('a failed reset for one run leaves other runs untouched', async () => {
    const registry = createInMemoryTestRegistry();
    const repo = new FixtureRepository(registry);
    const ok = await repo.create('runB', 'seed-b');
    if (!ok.ok) throw new Error('expected ok');
    registry.get('analytics').reset = () => {
      throw new Error('boom');
    };
    expect(await repo.reset('runA')).toMatchObject({ ok: false, code: 'RESET_FAILED' });
    for (const id of ALLOWLISTED_STORE_IDS) {
      const s = ok.fixture.subjects[0]!;
      expect(registry.get(id).observe('runB', s.subjectId, 1).state).toBe('PRESENT');
    }
  });
});

describe('allowlist rejection of invalid IDs (FOUNDATION-3)', () => {
  const badIds = ['', '..', '.', '../x', 'a/b', 'a\\b', 'a b', "x'; DROP TABLE t;--", '$(id)', 'arn:aws:s3:::bucket', 'a'.repeat(65)];

  it('create() and reset() reject invalid run IDs and seeds without touching stores', async () => {
    const registry = createInMemoryTestRegistry();
    const repo = new FixtureRepository(registry);
    for (const bad of badIds) {
      expect(await repo.create(bad, 'seed-a')).toMatchObject({ ok: false, code: 'INVALID_INPUT' });
      expect(await repo.create('run1', bad)).toMatchObject({ ok: false, code: 'INVALID_INPUT' });
      expect(await repo.reset(bad)).toMatchObject({ ok: false, code: 'INVALID_INPUT' });
    }
    expect(await repo.create(123 as never, 'seed-a')).toMatchObject({ ok: false, code: 'INVALID_INPUT' });
    expect(await repo.reset(undefined as never)).toMatchObject({ ok: false, code: 'INVALID_INPUT' });
    expect(registry.get('primary').observe('run1', 'x', 1).state).toBe('ABSENT');
  });

  it('registry rejects non-allowlisted store IDs of every shape', () => {
    const registry = createInMemoryTestRegistry();
    for (const bad of [...badIds, 'Primary', 'exports', 'primary ', '__proto__', 'constructor', 'toString']) {
      expect(() => registry.get(bad)).toThrow();
    }
  });

  it('adapters reject invalid run, subject and generation fields', () => {
    const p = createInMemoryTestRegistry().get('primary');
    for (const bad of badIds) {
      expect(() => p.create(bad, 's1', 1)).toThrow();
      expect(() => p.create('run1', bad, 1)).toThrow();
      expect(() => p.delete(bad, 's1', 1)).toThrow();
      expect(() => p.observe('run1', bad, 1)).toThrow();
      expect(() => p.reset(bad)).toThrow();
    }
    for (const bad of [-1, 1.5, NaN, Infinity, '1' as never, null as never]) {
      expect(() => p.create('run1', 's1', bad as number)).toThrow();
      expect(() => p.observe('run1', 's1', bad as number)).toThrow();
    }
  });
});
