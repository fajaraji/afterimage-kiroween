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

export interface InvestigationStep {
  number: 1 | 2 | 3 | 4;
  label: string;
  title: string;
  hint: string;
  watch: string;
  command?: Command;
}

export function nextStep(file: CaseFile): InvestigationStep {
  if (!file.erasureRequested)
    return {
      number: 1,
      label: 'Erase primary record',
      title: 'Start with the original.',
      hint: 'Press “Erase primary record” below the map to request deletion at the source. Then check the replica, export and vault for surviving copies.',
      watch: 'Watch the primary database. Erasure leaves it waiting for a check.',
      command: { type: 'erase-primary' }
    };
  const imported = file.events.some((event) => event.kind === 'restore');
  if (!imported && file.stores.some((store) => store.finding === 'unchecked'))
    return {
      number: 2,
      label: 'Scan all locations',
      title: 'Find what survived.',
      hint: 'Use “Scan all locations” to read the stores. A headstone means the record was absent at that read. A ghost means a copy was found.',
      watch: 'Look for the headstone and the ghosts as each read finishes.',
      command: { type: 'scan' }
    };
  const route = restoreRoute(file);
  if (route?.kind === 'confirmed')
    return {
      number: 4,
      label: 'View certificate',
      title: 'Explain how the record came back.',
      hint: 'Open the certificate. Compare the primary read before the import with the read that found the record again.',
      watch: 'The report names the source and shows both readings.'
    };
  if (route?.kind === 'possible' && !imported)
    return {
      number: 3,
      label: 'Restore from backup',
      title: 'Test the vault.',
      hint: 'The primary was clear, but the vault still holds a copy. Use “Restore from backup” below to import it and read the primary again.',
      watch: 'Follow the vault door, then watch the primary grave.',
      command: { type: 'restore' }
    };
  const pending = file.stores.find((store) => store.pendingCheck);
  if (pending)
    return {
      number: imported ? 4 : 3,
      label: 'Recheck ' + STORES[pending.id].name.toLowerCase(),
      title: 'Verify the change.',
      hint: 'Run the recheck below. Only a fresh read can say whether this location still contains the record.',
      watch: 'A successful read replaces the pending finding.',
      command: { type: 'inspect', store: pending.id }
    };
  return {
    number: 4,
    label: 'View certificate',
    title: 'Read the findings.',
    watch: 'Check the time and scope of each reading.',
    hint:
      imported && evidence(file, 'primary').finding === 'unreachable'
        ? 'The import was recorded, but the primary could not be read. The certificate shows that gap.'
        : 'Review the latest finding for each location, including any gaps in the evidence.'
  };
}
