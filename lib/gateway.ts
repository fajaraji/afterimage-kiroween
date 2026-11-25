import { isCaseFile, runDemo, startDemo, STORE_IDS } from './case.ts';
import type { CaseFile, Command, DemoSession } from './case';

const base = process.env.NEXT_PUBLIC_AFTERIMAGE_API_BASE?.replace(/\/+$/, '');
export const demoMode = !base;
const key = 'afterimage:case:v1:' + (base || 'demo');
let memory: string | null = null;
let session: DemoSession | undefined;

function saved() {
  try { return sessionStorage.getItem(key) ?? memory; } catch { return memory; }
}

function save(value: string) {
  memory = value;
  try { sessionStorage.setItem(key, value); } catch { /* This tab still has in-memory state. */ }
}

async function remote(path: string, method: 'GET' | 'POST', body?: unknown) {
  const response = await fetch(base + path, {
    method, credentials: 'include', cache: 'no-store', signal: AbortSignal.timeout(15000),
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  if (!response.ok) throw new Error(response.status === 409 ? 'This case changed. Reload the latest evidence before retrying.' :
    'The case service returned HTTP ' + response.status + '. Reload the case to check its latest state.');
  const file: unknown = await response.json();
  if (!isCaseFile(file)) throw new Error('The case service returned an incomplete evidence record.');
  return file;
}

function rememberDemo(next: DemoSession) {
  session = next;
  save(JSON.stringify(next));
  return next.file;
}

export async function openCase(reset = false): Promise<CaseFile> {
  const value = saved();
  if (base) {
    const file = await (reset || !value ? remote('/cases', 'POST', {}) : remote('/cases/' + encodeURIComponent(value), 'GET'));
    save(file.id);
    return file;
  }
  if (value && !reset) {
    try {
      const parsed = JSON.parse(value);
      if (isCaseFile(parsed?.file) && STORE_IDS.every(id => typeof parsed.copies?.[id] === 'boolean')) return rememberDemo(parsed);
    } catch { /* Start a fresh fictional case if browser storage is obsolete. */ }
  }
  return rememberDemo(startDemo(crypto.randomUUID(), new Date().toISOString()));
}

export async function commandCase(file: CaseFile, command: Command): Promise<CaseFile> {
  if (base) {
    return remote('/cases/' + encodeURIComponent(file.id) + '/commands', 'POST', {
      commandId: crypto.randomUUID(), expectedRevision: file.revision, command
    });
  }
  if (!session || session.file.id !== file.id || session.file.revision !== file.revision) {
    throw new Error('Reload the case to pick up its latest evidence.');
  }
  await new Promise(resolve => setTimeout(resolve, command.type === 'scan' || command.type === 'restore' ? 650 : 300));
  return rememberDemo(runDemo(session, command, new Date().toISOString()));
}
