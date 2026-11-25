import { Activity, ArchiveRestore, ClipboardList, FileBadge, Fingerprint, Printer, ScanLine, ScrollText, ShieldCheck, Trash2 } from 'lucide-react';
import { outcome, STORES } from '../lib/case';
import type { CaseFile } from '../lib/case';
import { clockTime, fullTime, Status } from './Common';

const icons = {opened:ClipboardList, erasure:Trash2, inspection:ScanLine, restore:ArchiveRestore, return:Activity};

export function EventLog({ file }: { file: CaseFile }) {
  return <section className="panel event-panel"><div className="panel-bar"><h2><Activity />Case activity</h2><span className="small-meta">{file.events.length} {file.events.length === 1 ? 'event' : 'events'}</span></div>
    <ol className="event-list">{[...file.events].reverse().map(event => { const Icon = icons[event.kind];
      return <li key={event.seq} className={event.kind}><span className="event-icon"><Icon size={16}/></span><div><h3>{event.title}</h3><p>{event.detail}</p></div><time dateTime={event.at} title={fullTime(event.at)}>{clockTime(event.at)} UTC</time></li>;
    })}</ol></section>;
}

export function Certificate({ file, demo }: { file: CaseFile; demo: boolean }) {
  const remaining = file.stores.filter(s => outcome(s) === 'found').length;
  const unverified = file.stores.filter(s => outcome(s) === 'unverified').length;
  const result = remaining ? 'Copies remain' : unverified ? 'Incomplete inspection' : 'Verified clear';
  const last = file.events.at(-1)!;
  const returned = file.events.findLast(e => e.kind === 'return');
  return <section className="certificate-wrap"><div className="cert-toolbar"><span><ScrollText size={16}/>Evidence as of {fullTime(last.at)}</span><button className="secondary-button" onClick={() => window.print()}><Printer size={15} />Print / save PDF</button></div>
    <article className="certificate-paper"><div className="cert-inner">
      <div className="cert-head"><span className="cert-imprint"><FileBadge size={23}/>Afterimage</span><span>{file.reference} · REV {String(file.revision).padStart(2,'0')}</span></div>
      <div className="cert-title"><div><span className="field-label">{demo ? 'Simulated evidence · fictional case' : 'Erasure evidence'}</span><h2>Data death certificate</h2></div><ShieldCheck size={48} strokeWidth={1} /></div>
      <p className="cert-intro">Erasure findings for <strong>{file.subject.name}</strong> ({file.subject.id}) across the four locations in this case.</p>
      <div className="cert-verdict"><span className="field-label">Inspection outcome</span><strong>{result}</strong></div>
      <table><thead><tr><th>Location</th><th>Finding</th><th>Last inspected (UTC)</th></tr></thead>
        <tbody>{file.stores.map(item => <tr key={item.id}><td>{STORES[item.id].name}</td><td><Status item={item}/></td><td>{item.checkedAt ? fullTime(item.checkedAt) : 'Unverified'}</td></tr>)}</tbody></table>
      {returned && <div className="cert-note"><strong>Restoration evidence</strong><p>{returned.detail} Recorded {fullTime(returned.at)}.</p></div>}
      <p className="scope-note">Scope covers the reads recorded above. A pending recheck or an inaccessible location remains unverified. Later restores can change these findings.</p>
      <div className="cert-foot"><span><Fingerprint size={14}/>{file.subject.id}</span><span>{demo ? 'Demo workspace' : 'Connected workspace'} · {file.reference}</span></div>
    </div></article></section>;
}
