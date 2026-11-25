import { ArrowLeft, ArrowRight, ArchiveRestore, CircleCheck, Fingerprint, FolderOpen, ScanLine, Trash2 } from 'lucide-react';
import { canRestore, evidence, outcome, STORES, STORE_IDS } from '../lib/case';
import type { CaseFile, Command, StoreId } from '../lib/case';
import { clockTime, Status, STORE_ICONS } from './Common';

interface Step {
  label: string;
  hint: string;
  command?: Command;
}

function nextStep(file: CaseFile): Step {
  if (!file.erasureRequested) return { label: 'Erase primary record', hint: 'Remove the active record, then trace the copies left behind.', command: { type: 'erase-primary' } };
  if (file.stores.some(s => s.finding === 'unchecked')) return { label: 'Scan all locations', hint: 'Read all four stores to find out where this record still exists.', command: { type: 'scan' } };
  const pending = file.stores.find(s => s.pendingCheck);
  if (pending) return { label: 'Recheck location', hint: 'Read ' + STORES[pending.id].name.toLowerCase() + ' to verify its erasure.', command: { type: 'inspect', store: pending.id } };
  if (file.events.some(e => e.kind === 'return')) return { label: 'View certificate', hint: 'Review the restored record and the latest finding at each location.' };
  const copy = file.stores.find(s => s.id !== 'backup' && outcome(s) === 'found');
  if (copy) return { label: 'Erase ' + STORES[copy.id].short.toLowerCase(), hint: 'Remove the surviving copy, then inspect this location again.', command: { type: 'erase-copy', store: copy.id } };
  if (canRestore(file)) return { label: 'Restore snapshot', hint: 'Restore the retained snapshot to see whether the erased record returns.', command: { type: 'restore' } };
  return { label: 'View certificate', hint: 'Review the findings, including any locations outside inspection scope.' };
}

export function CasePanel({ file, selected, clearSelection, run, busy, certificate }: {
  file: CaseFile; selected: StoreId | null; clearSelection: () => void;
  run: (command: Command) => void; busy: boolean; certificate: () => void;
}) {
  const step = nextStep(file);
  const counts = { found: 0, clear: 0, unverified: 0 };
  file.stores.forEach(s => { counts[outcome(s)]++; });
  const item = selected ? evidence(file, selected) : null;
  const Icon = selected ? STORE_ICONS[selected] : FolderOpen;
  const caseState = !file.erasureRequested ? 'Open request' : counts.clear === 4 ? 'All clear' : evidence(file, 'primary').finding === 'returned' ? 'Record returned' : 'In progress';
  const StepIcon = step.command?.type === 'restore' ? ArchiveRestore : step.command?.type === 'erase-copy' || step.command?.type === 'erase-primary' ? Trash2 : step.command ? ScanLine : CircleCheck;
  return <aside className="panel case-panel" id="case-panel" aria-label={selected ? 'Location evidence' : 'Case file'} tabIndex={-1}>
    <div className="panel-bar"><h2><Icon />{selected ? 'Location evidence' : 'Case file'}</h2>
      {selected ? <button className="back-link" onClick={clearSelection}><ArrowLeft size={14} />Case file</button> : <span className="file-ref">{file.reference}</span>}
    </div>
    {selected && item ? <div className="case-body location-details">
      <div className="subject"><span className="field-label">{STORES[selected].technology}</span><h3>{STORES[selected].name}</h3><Status item={item} /></div>
      <p>{STORES[selected].description}</p>
      <dl className="facts"><div><dt>Resource</dt><dd>{item.resource || 'Not supplied'}</dd></div><div><dt>Last checked</dt><dd>{item.checkedAt ? clockTime(item.checkedAt) + ' UTC' : 'Awaiting inspection'}</dd></div>
      {item.sourceId && <div><dt>Source</dt><dd>{STORES[item.sourceId].name}</dd></div>}</dl>
      <div className="location-actions">
        {!file.erasureRequested ? <button className="primary-button" disabled={busy} onClick={() => run({type:'erase-primary'})}><Trash2 size={16} />Erase primary record<ArrowRight size={16}/></button> : <>
          {selected === 'backup' && canRestore(file) && <button className="primary-button" disabled={busy} onClick={() => run({type:'restore'})}><ArchiveRestore size={16} />Restore snapshot</button>}
          {outcome(item) === 'found' && <button className={selected === 'backup' && canRestore(file) ? 'secondary-button' : 'primary-button'} disabled={busy} onClick={() => run({type:'erase-copy',store:selected})}><Trash2 size={16} />Erase this copy</button>}
          <button className={outcome(item) === 'found' ? 'secondary-button' : 'primary-button'} disabled={busy} onClick={() => run({type:'inspect',store:selected})}><ScanLine size={16} />{item.pendingCheck ? 'Recheck location' : 'Inspect location'}</button>
        </>}
      </div>
    </div> : <div className="case-body">
      <div className="subject"><div className="subject-top"><span className="field-label">Data subject</span><span className="case-state"><i />{caseState}</span></div>
        <h3>{file.subject.name}</h3><span className="subject-id"><Fingerprint size={14} />{file.subject.id}</span></div>
      <div className="inspection"><span className="field-label">Inspection results</span>
        <div className="count-grid">{(['found','clear','unverified'] as const).map((k, i) => <div key={k} className={'count ' + k}>
          <strong>{String(counts[k]).padStart(2,'0')}</strong><span>{['Copies found','Verified clear','Unverified'][i]}</span></div>)}</div>
        <div className="inspection-track" aria-hidden="true">{STORE_IDS.map(id => <i key={id} className={outcome(evidence(file,id))} />)}</div>
      </div>
      <div className="next-action"><span className="field-label">Next action</span><p>{step.hint}</p><button className="primary-button" disabled={busy} onClick={() => step.command ? run(step.command) : certificate()}><StepIcon size={16} />{busy ? 'Working…' : step.label}<ArrowRight size={16} /></button></div>
    </div>}
  </aside>;
}
