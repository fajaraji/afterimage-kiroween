/**
 * This small, implemented pure reducer is ONLY a starting building block.
 * It does not query stores, execute deletion, run scenarios, or prove erasure.
 */
export type Observation = { storeId: string; state: 'PRESENT' | 'ABSENT' | 'UNKNOWN' };
export type Verdict = 'PASS' | 'FAIL' | 'UNKNOWN';

export function reduceObservedDeletion(
  requiredStoreIds: readonly string[],
  observations: readonly Observation[],
): Verdict {
  if (requiredStoreIds.length === 0 || new Set(requiredStoreIds).size !== requiredStoreIds.length) return 'UNKNOWN';
  const required = new Set(requiredStoreIds);
  const seen = new Set<string>();
  for (const o of observations) {
    if (!required.has(o.storeId) || seen.has(o.storeId)) return 'UNKNOWN';
    if (o.state !== 'PRESENT' && o.state !== 'ABSENT' && o.state !== 'UNKNOWN') return 'UNKNOWN';
    seen.add(o.storeId);
  }
  if (observations.some((o) => o.state === 'PRESENT')) return 'FAIL';
  if (seen.size !== required.size || observations.some((o) => o.state === 'UNKNOWN')) return 'UNKNOWN';
  return 'PASS';
}
