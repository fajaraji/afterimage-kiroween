import { Archive, ChartNoAxesCombined, CircleDashed, Database, FileText, Ghost, Hourglass, ShieldQuestion } from 'lucide-react';
import { statusText } from '../lib/case';
import type { StoreEvidence } from '../lib/case';

export const STORE_ICONS = { primary: Database, analytics: ChartNoAxesCombined, export: FileText, backup: Archive };

export function Grave({ size = 15 }: { size?: number }) {
  return <span className="grave-icon" aria-hidden="true" style={{ width: size, height: size }}><i /></span>;
}

export function StatusIcon({ item, size = 15 }: { item: StoreEvidence; size?: number }) {
  if (item.pendingCheck) return <Hourglass size={size} />;
  if (item.finding === 'clear') return <Grave size={size} />;
  if (item.finding === 'found' || item.finding === 'returned') return <Ghost size={size} />;
  if (item.finding === 'unreachable') return <ShieldQuestion size={size} />;
  return <CircleDashed size={size} />;
}

export function Status({ item }: { item: StoreEvidence }) {
  return <span className={'status ' + (item.pendingCheck ? 'pending' : item.finding)}>
    <StatusIcon item={item} size={13} />{statusText(item)}
  </span>;
}

export function clockTime(iso: string | null) {
  return iso ? new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).format(new Date(iso)) : 'Not checked';
}

export function fullTime(iso: string) {
  return new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).format(new Date(iso)) + ' UTC';
}
