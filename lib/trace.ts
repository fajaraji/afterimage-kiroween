import { evidence, STORE_IDS, STORES } from './case.ts';
import type { CaseEvent, CaseFile, Command, StoreEvidence, StoreId } from './case.ts';

export interface Trace {
  kind: 'seed' | 'erase' | 'inspect' | 'restore';
  targets: StoreId[];
  source?: StoreId;
  confirmedReturn?: boolean;
  title: string;
  detail: string;
}
export interface Playback {
  trace: Trace;
  before: StoreEvidence[];
  at: number;
}

// This describes a completed command. Pending requests never grant evidence.
export function traceResult(before: CaseFile, after: CaseFile, command: Command): Trace {
  const events = after.events.filter((event) => event.seq > before.events.at(-1)!.seq);
  return describe(after, command, events);
}

function describe(after: CaseFile, command: Command, events: CaseEvent[]): Trace {
  if (command.type === 'restore') {
    const restoration = events.find((e) => e.kind === 'restore');
    const reading = events.find((e) => e.kind === 'return' && e.store === 'primary');
    const primary = evidence(after, 'primary');
    const confirmed = !!reading && primary.finding === 'returned' && !primary.pendingCheck;
    const recordedSource = restoration?.store;
    const source =
      recordedSource && recordedSource !== 'primary' ? recordedSource : confirmed ? primary.sourceId : null;
    return {
      kind: 'restore',
      targets: ['primary'],
      source: source && source !== 'primary' ? source : undefined,
      confirmedReturn: confirmed,
      title:
        confirmed && source
          ? STORES[source].name + ' → Primary database · Record returned'
          : confirmed
            ? 'Record returned to the primary database'
            : 'Restore received',
      detail:
        reading?.detail ||
        restoration?.detail ||
        'Check the latest primary inspection before drawing a conclusion.'
    };
  }
  if (command.type === 'inspect' || command.type === 'scan') {
    const targets = command.type === 'inspect' ? [command.store] : [...STORE_IDS];
    const found = targets.filter((id) => {
      const s = evidence(after, id);
      return !s.pendingCheck && (s.finding === 'found' || s.finding === 'returned');
    }).length;
    return {
      kind: 'inspect',
      targets,
      title:
        targets.length === 1
          ? 'Inspection at ' + STORES[targets[0]].name.toLowerCase()
          : 'Inspection finished',
      detail: found + (found === 1 ? ' surviving copy' : ' surviving copies') + ' in these results.'
    };
  }
  const id = command.type === 'erase-copy' ? command.store : 'primary';
  return {
    kind: 'erase',
    targets: [id],
    title: 'Erasure requested at ' + STORES[id].name.toLowerCase(),
    detail: 'A fresh read is needed to establish whether the record is gone.'
  };
}

export function seedTrace(file: CaseFile, demo: boolean): Trace | null {
  if (!demo || file.revision !== 0 || file.events.at(-1)?.kind !== 'opened') return null;
  return {
    kind: 'seed',
    targets: ['analytics', 'export', 'backup'],
    source: 'primary',
    title: 'One record, four locations',
    detail: 'The demo seeded a primary record and three downstream copies.'
  };
}

export function openPlayback(file: CaseFile, demo: boolean, now: number): Playback | null {
  const seed = seedTrace(file, demo);
  if (seed) return { trace: seed, before: [], at: now };
  const last = file.events.at(-1)!;
  const previous = file.events.at(-2);
  let trace: Trace | null = null;
  if (last.kind === 'return' && previous?.kind === 'restore')
    trace = describe(file, { type: 'restore' }, [previous, last]);
  else if (last.kind === 'restore') trace = describe(file, { type: 'restore' }, [last]);
  else if (last.kind === 'inspection' && last.store)
    trace = describe(file, { type: 'inspect', store: last.store }, [last]);
  else if (last.kind === 'erasure' && last.store)
    trace = describe(file, { type: 'erase-copy', store: last.store }, [last]);
  // A reload opens on the recorded result. Replay is an explicit view action.
  return trace ? { trace, before: [], at: -Infinity } : null;
}
