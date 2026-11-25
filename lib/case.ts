export const STORE_IDS = ['primary', 'analytics', 'export', 'backup'] as const;
export type StoreId = typeof STORE_IDS[number];
export type Finding = 'unchecked' | 'found' | 'clear' | 'returned' | 'unreachable';

export const STORES = {
  primary: { name: 'Primary database', short: 'Primary database', technology: 'DynamoDB', resource: 'customers', description: 'The active customer record lives here.' },
  analytics: { name: 'Analytics replica', short: 'Analytics replica', technology: 'DynamoDB Streams', resource: 'customer-analytics', description: 'The analytics pipeline keeps a separate copy of customer activity.' },
  export: { name: 'File export', short: 'File export', technology: 'S3 object', resource: 'exports/customers.csv', description: 'A customer export can retain a row after its source record is erased.' },
  backup: { name: 'Backup vault', short: 'Backup vault', technology: 'S3 snapshot', resource: 'snapshots/SNP-0042', description: 'A retained snapshot can reintroduce an erased record when restored.' }
} satisfies Record<StoreId, { name: string; short: string; technology: string; resource: string; description: string }>;

export interface StoreEvidence {
  id: StoreId;
  finding: Finding;
  pendingCheck: boolean;
  checkedAt: string | null;
  sourceId: StoreId | null;
  resource?: string;
}

export interface CaseEvent {
  seq: number;
  at: string;
  kind: 'opened' | 'erasure' | 'inspection' | 'restore' | 'return';
  title: string;
  detail: string;
  store: StoreId | null;
}

export interface CaseFile {
  version: 1;
  id: string;
  revision: number;
  reference: string;
  subject: { name: string; id: string };
  startedAt: string;
  erasureRequested: boolean;
  stores: StoreEvidence[];
  events: CaseEvent[];
}

export type Command =
  | { type: 'erase-primary' | 'scan' | 'restore' }
  | { type: 'erase-copy' | 'inspect'; store: StoreId };

export interface DemoSession {
  file: CaseFile;
  copies: Record<StoreId, boolean>;
}

export function startDemo(id: string, at: string): DemoSession {
  return {
    file: {
      version: 1, id, revision: 0, reference: 'ER-017',
      subject: { name: 'Evelyn Marlow', id: 'CUS-0713' }, startedAt: at,
      erasureRequested: false,
      stores: STORE_IDS.map(store => ({ id: store, resource: STORES[store].resource, finding: 'unchecked', pendingCheck: false, checkedAt: null, sourceId: store === 'primary' ? null : 'primary' })),
      events: [{ seq: 1, at, kind: 'opened', title: 'Case opened', detail: 'A fictional customer record was seeded across four storage locations.', store: null }]
    },
    copies: { primary: true, analytics: true, export: true, backup: true }
  };
}

export function evidence(file: CaseFile, id: StoreId): StoreEvidence {
  return file.stores.find(store => store.id === id)!;
}

export function statusText(store: StoreEvidence) {
  if (store.pendingCheck) return 'Recheck needed';
  return { unchecked: 'Unchecked', found: 'Copy found', clear: 'Verified clear', returned: 'Resurrected', unreachable: 'Out of scope' }[store.finding];
}

export function outcome(store: StoreEvidence): 'clear' | 'found' | 'unverified' {
  if (store.pendingCheck) return 'unverified';
  if (store.finding === 'clear') return 'clear';
  if (store.finding === 'found' || store.finding === 'returned') return 'found';
  return 'unverified';
}

export function canRestore(file: CaseFile) {
  return outcome(evidence(file, 'primary')) === 'clear' && outcome(evidence(file, 'backup')) === 'found';
}

// In demo mode these booleans represent the physical copies. Evidence changes
// only after a read, even when a removal has already changed the stored copy.
export function runDemo(previous: DemoSession, command: Command, at: string): DemoSession {
  const session = structuredClone(previous);
  const { file, copies } = session;
  function log(kind: CaseEvent['kind'], title: string, detail: string, store: StoreId | null) {
    file.events.push({ seq: file.events.at(-1)!.seq + 1, at, kind, title, detail, store });
  }
  function inspect(id: StoreId, returned = false) {
    const item = evidence(file, id);
    const isReturn = returned || item.finding === 'returned';
    item.finding = copies[id] ? (isReturn ? 'returned' : 'found') : 'clear';
    item.checkedAt = at;
    item.pendingCheck = false;
    log(returned ? 'return' : 'inspection', STORES[id].name + ' · ' + statusText(item),
      returned ? 'A read confirmed the record returned from snapshot SNP-0042 in the backup vault.' :
        copies[id] ? 'The read returned a matching customer record.' : 'The read found no matching customer record.', id);
  }
  if (command.type === 'erase-primary') {
    if (file.erasureRequested) throw new Error('The erasure request has already started.');
    file.erasureRequested = true;
    copies.primary = false;
    evidence(file, 'primary').pendingCheck = true;
    log('erasure', 'Primary erasure requested', 'The active record was removed. A new inspection is due.', 'primary');
  } else {
    if (!file.erasureRequested) throw new Error('Erase the primary record to start this case.');
    switch (command.type) {
      case 'scan':
        STORE_IDS.forEach(id => inspect(id));
        break;
      case 'inspect':
        inspect(command.store);
        break;
      case 'erase-copy': {
        const item = evidence(file, command.store);
        if (outcome(item) !== 'found') throw new Error('Inspect this location before erasing a copy.');
        copies[command.store] = false;
        item.pendingCheck = true;
        log('erasure', 'Copy erasure requested', STORES[command.store].name + ' awaits an independent recheck.', command.store);
        break;
      }
      case 'restore':
        if (!canRestore(file) || !copies.backup) throw new Error('Restoration needs a retained backup and a verified-clear primary database.');
        copies.primary = true;
        evidence(file, 'primary').sourceId = 'backup';
        log('restore', 'Backup restored', 'Snapshot SNP-0042 was imported from the backup vault into the primary database.', 'backup');
        inspect('primary', true);
        break;
    }
  }
  file.revision++;
  return session;
}

const object = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;
const timestamp = (value: unknown) => typeof value === 'string' && Number.isFinite(Date.parse(value));
const storeId = (value: unknown) => STORE_IDS.some(id => id === value);
const natural = (value: unknown) => typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;

export function isCaseFile(value: unknown): value is CaseFile {
  if (!object(value) || value.version !== 1 || typeof value.id !== 'string' || !value.id ||
      !natural(value.revision) || typeof value.reference !== 'string' || !timestamp(value.startedAt) ||
      !object(value.subject) || typeof value.subject.id !== 'string' || typeof value.subject.name !== 'string' ||
      typeof value.erasureRequested !== 'boolean' || !Array.isArray(value.stores) ||
      value.stores.length !== STORE_IDS.length || !Array.isArray(value.events) || !value.events.length) return false;
  const stores = value.stores;
  const complete = STORE_IDS.every(id => stores.some(s => object(s) && s.id === id));
  const fields = stores.every(s => object(s) && typeof s.pendingCheck === 'boolean' &&
    typeof s.finding === 'string' && ['unchecked', 'found', 'clear', 'returned', 'unreachable'].includes(s.finding) &&
    (s.resource === undefined || typeof s.resource === 'string') &&
    (s.sourceId === null || storeId(s.sourceId)) &&
    (timestamp(s.checkedAt) || (s.checkedAt === null && (s.finding === 'unchecked' || s.finding === 'unreachable'))));
  return complete && fields && value.events.every(e => object(e) && natural(e.seq) && timestamp(e.at) &&
    ['opened', 'erasure', 'inspection', 'restore', 'return'].includes(String(e.kind)) &&
    typeof e.title === 'string' && typeof e.detail === 'string' && (e.store === null || storeId(e.store)));
}
