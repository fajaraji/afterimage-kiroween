import { ArrowLeft, ArrowUpRight, CircleDashed, Ghost } from 'lucide-react';
import { evidence, outcome, STORES } from '../lib/case';
import type { CaseFile, StoreId } from '../lib/case';
import { clockTime, Grave, Status } from './Common';

export function CasePanel({
  file,
  selected,
  clearSelection,
  openLog
}: {
  file: CaseFile;
  selected: StoreId | null;
  clearSelection: () => void;
  openLog: () => void;
}) {
  const item = selected ? evidence(file, selected) : null;
  const counts = { found: 0, clear: 0, unverified: 0 };
  file.stores.forEach((s) => counts[outcome(s)]++);
  const last = file.events.at(-1)!;
  return (
    <aside
      className="case-sheet"
      id="case-panel"
      aria-label={selected ? 'Location evidence' : 'Case file'}
      tabIndex={-1}
    >
      <div className="case-rubric">
        <span>{selected ? 'Location evidence' : 'Case file'}</span>
        <span>{file.reference}</span>
      </div>
      {selected && item ? (
        <>
          <div className="case-name">
            <span className="field-label">{STORES[selected].technology}</span>
            <h2>{STORES[selected].name}</h2>
            <Status item={item} />
          </div>
          <p className="case-description">{STORES[selected].description}</p>
          <dl className="case-facts facts">
            <div>
              <dt>Resource</dt>
              <dd>{item.resource || 'Not supplied'}</dd>
            </div>
            <div>
              <dt>Last checked</dt>
              <dd>{item.checkedAt ? clockTime(item.checkedAt) + ' UTC' : 'Awaiting inspection'}</dd>
            </div>
            {item.sourceId && (
              <div>
                <dt>Source</dt>
                <dd>{STORES[item.sourceId].name}</dd>
              </div>
            )}
          </dl>
          <button className="paper-link" onClick={clearSelection}>
            <ArrowLeft size={14} />
            Case file
          </button>
        </>
      ) : (
        <>
          <div className="case-name">
            <span className="field-label">Data subject</span>
            <h2>{file.subject.name}</h2>
            <span className="paper-id">{file.subject.id}</span>
          </div>
          <dl className="finding-counts">
            <div>
              <dt>
                <Ghost size={15} />
                Copies found
              </dt>
              <dd>{counts.found}</dd>
            </div>
            <div>
              <dt>
                <Grave size={15} />
                Verified clear
              </dt>
              <dd>{counts.clear}</dd>
            </div>
            <div>
              <dt>
                <CircleDashed size={14} />
                Unverified
              </dt>
              <dd>{counts.unverified}</dd>
            </div>
          </dl>
        </>
      )}
      <div className="case-entry">
        <div className="entry-time">
          <span className="field-label">Latest entry</span>
          <time dateTime={last.at}>{clockTime(last.at)} UTC</time>
        </div>
        <h3>{last.title}</h3>
        <p>{last.detail}</p>
        <button className="paper-link" onClick={openLog}>
          Read event log
          <ArrowUpRight size={13} />
        </button>
      </div>
    </aside>
  );
}
