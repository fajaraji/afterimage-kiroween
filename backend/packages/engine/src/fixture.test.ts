import { describe, expect, it } from 'vitest';
import { buildFixture, computeFixtureHash, FixtureRepository } from './fixture.js';
import { createInMemoryTestRegistry, InMemoryStoreAdapter, StoreRegistry } from './memory-stores.js';

describe('seeded fixture (local fakes, not AWS evidence)', () => {
  it('same seed yields identical subjects and hash across runs', async () => {
    const repo = new FixtureRepository(createInMemoryTestRegistry());
    const a = await repo.create('run1', 'seed-a');
    const b = await repo.create('run2', 'seed-a');
    if (!a.ok || !b.ok) throw new Error('expected ok');
    expect(a.fixture).toEqual(b.fixture);
    expect(a.fixture.fixtureHash).toBe(computeFixtureHash('seed-a'));
  });

  it('different seed yields different hash and subject IDs', () => {
    const a = buildFixture('seed-a');
    const b = buildFixture('seed-b');
    expect(a.fixtureHash).not.toBe(b.fixtureHash);
    expect(a.subjects[0]!.subjectId).not.toBe(b.subjects[0]!.subjectId);
  });

  it('seeds every store and reset clears them', async () => {
    const registry = createInMemoryTestRegistry();
    const repo = new FixtureRepository(registry);
    const r = await repo.create('run1', 'seed-a');
    if (!r.ok) throw new Error('expected ok');
    const s = r.fixture.subjects[0]!;
    for (const id of registry.ids()) expect(registry.get(id).observe('run1', s.subjectId, 1).state).toBe('PRESENT');
    expect((await repo.reset('run1')).ok).toBe(true);
    for (const id of registry.ids()) expect(registry.get(id).observe('run1', s.subjectId, 1).state).toBe('ABSENT');
  });

  it('re-creating after mutation restores the same state', async () => {
    const registry = createInMemoryTestRegistry();
    const repo = new FixtureRepository(registry);
    const r = await repo.create('run1', 'seed-a');
    if (!r.ok) throw new Error('expected ok');
    const s = r.fixture.subjects[0]!;
    registry.get('primary').delete('run1', s.subjectId, 1);
    const again = await repo.create('run1', 'seed-a');
    expect(again.ok && again.fixture.fixtureHash).toBe(r.fixture.fixtureHash);
    expect(registry.get('primary').observe('run1', s.subjectId, 1).state).toBe('PRESENT');
  });

  it('returns explicit error, not a verdict, when reset fails', async () => {
    const failing = new InMemoryStoreAdapter('analytics');
    failing.reset = () => {
      throw new Error('reset boom');
    };
    const registry = new StoreRegistry<InMemoryStoreAdapter>([
      new InMemoryStoreAdapter('primary'),
      failing,
      new InMemoryStoreAdapter('exports'),
    ]);
    const res = await new FixtureRepository(registry).create('run1', 'seed-a');
    expect(res).toMatchObject({ ok: false, code: 'RESET_FAILED', storeId: 'analytics' });
    expect(res).not.toHaveProperty('verdict');
    expect(res).not.toHaveProperty('fixture');
  });

  it('returns INIT_FAILED when a store is unreachable during seeding', async () => {
    const res = await new FixtureRepository(createInMemoryTestRegistry(['exports'])).create('run1', 'seed-a');
    expect(res).toMatchObject({ ok: false, code: 'INIT_FAILED', storeId: 'exports' });
  });

  it('rejects invalid run IDs and seeds explicitly', async () => {
    const repo = new FixtureRepository(createInMemoryTestRegistry());
    expect(await repo.create('../x', 'seed-a')).toMatchObject({ ok: false, code: 'INVALID_INPUT' });
    expect(await repo.create('run1', 'bad seed!')).toMatchObject({ ok: false, code: 'INVALID_INPUT' });
    expect(await repo.reset('')).toMatchObject({ ok: false, code: 'INVALID_INPUT' });
  });

  it('contains no personal identity fields or wall-clock timestamps', () => {
    const f = buildFixture('seed-a');
    const text = JSON.stringify(f);
    expect(text).not.toMatch(/email|name|phone|address|@/i);
    expect(Object.keys(f.subjects[0]!).sort()).toEqual(['createdAtSequence', 'generation', 'subjectId']);
  });
});
