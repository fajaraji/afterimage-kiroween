import { canRestore, evidence, STORES } from './case.ts';
import type { CaseFile, Command, StoreId } from './case.ts';

export type RestoreRoute = { kind: 'possible' | 'confirmed'; source: StoreId };

export function restoreRoute(file: CaseFile): RestoreRoute | null {
  const primary = evidence(file, 'primary');
  const lastImport = file.events.findLast((event) => event.kind === 'restore');
  if (lastImport) {
    const read = file.events.findLast((event) => event.kind === 'return' && event.store === 'primary');
    if (
      primary.finding === 'returned' &&
      !primary.pendingCheck &&
      primary.sourceId &&
      primary.sourceId !== 'primary' &&
      primary.sourceId === lastImport.store &&
      read &&
      read.seq > lastImport.seq
    ) {
      return { kind: 'confirmed', source: primary.sourceId };
    }
    // A previous clear reading cannot establish eligibility again after an import.
    const freshClear = file.events.some(
      (event) => event.seq > lastImport.seq && event.kind === 'inspection' && event.store === 'primary'
    );
    if (!freshClear) return null;
  }
  return canRestore(file) ? { kind: 'possible', source: 'backup' } : null;
}

interface InvestigationStep {
  number: 1 | 2 | 3 | 4;
  label: string;
  hint: string;
  command?: Command;
}

export function nextStep(file: CaseFile): InvestigationStep {
  if (!file.erasureRequested)
    return {
      number: 1,
      label: 'Erase primary record',
      hint: 'Erase the active record first. Then check which copies survive.',
      command: { type: 'erase-primary' }
    };
  const imported = file.events.some((event) => event.kind === 'restore');
  if (!imported && file.stores.some((store) => store.finding === 'unchecked'))
    return {
      number: 2,
      label: 'Scan all locations',
      hint: 'Erasure was requested. Read all four locations to find out what survived.',
      command: { type: 'scan' }
    };
  const route = restoreRoute(file);
  if (route?.kind === 'confirmed')
    return {
      number: 4,
      label: 'View certificate',
      hint: 'A fresh read found the record back in the primary database. See the evidence.'
    };
  if (route?.kind === 'possible' && !imported)
    return {
      number: 3,
      label: 'Restore from backup',
      hint: 'The primary is clear. The vault still has a copy. Restore it to see if the record returns.',
      command: { type: 'restore' }
    };
  const pending = file.stores.find((store) => store.pendingCheck);
  if (pending)
    return {
      number: imported ? 4 : 3,
      label: 'Recheck ' + STORES[pending.id].name.toLowerCase(),
      hint: 'A change at this location still needs a fresh read. Check what it contains now.',
      command: { type: 'inspect', store: pending.id }
    };
  return {
    number: 4,
    label: 'View certificate',
    hint:
      imported && evidence(file, 'primary').finding === 'unreachable'
        ? 'The import was recorded, but the primary could not be read. The certificate shows that gap.'
        : 'Review the latest finding for each location, including any gaps in the evidence.'
  };
}
