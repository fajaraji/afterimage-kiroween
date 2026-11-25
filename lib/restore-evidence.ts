import type { CaseFile } from './case.ts';

// Show the recorded observations verbatim, including events from older v1 cases.
export function compareRestoreReads(file: CaseFile) {
  const imported = file.events.findLast((event) => event.kind === 'restore');
  if (!imported) return null;
  const primaryReads = file.events.filter(
    (event) => event.store === 'primary' && (event.kind === 'inspection' || event.kind === 'return')
  );
  const before = primaryReads.findLast((event) => event.seq < imported.seq);
  const nextErasure = file.events.find(
    (event) => event.seq > imported.seq && event.kind === 'erasure' && event.store === 'primary'
  );
  const following = primaryReads.filter(
    (event) => event.seq > imported.seq && (!nextErasure || event.seq < nextErasure.seq)
  );
  const after = following.find((event) => event.kind === 'return') ?? following[0];
  return { imported, before, after };
}
