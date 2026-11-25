import { ArrowLeft, ArrowUpRight, CircleDashed, Ghost } from 'lucide-react';
import { evidence, outcome, STORES } from '../lib/case';
import { nextStep, restoreRoute } from '../lib/investigation';
import type { CaseFile, Command, StoreId } from '../lib/case';
import { clockTime, Grave, Status } from './Common';

export function CasePanel({
  file,
  selected,
  busy,
  run,
  clearSelection,
  openLog
}: {
  file: CaseFile;
  selected: StoreId | null;
  busy: boolean;
  run: (command: Command) => void;
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
      <DeathHead />
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
          {file.erasureRequested && (
            <div className="location-actions">
              <button
                className="paper-link"
                disabled={busy}
                onClick={() => run({ type: 'inspect', store: selected })}
              >
                {item.checkedAt || item.pendingCheck ? 'Recheck this location' : 'Inspect this location'}
              </button>
              {outcome(item) === 'found' && (
                <button
                  className="paper-link"
                  disabled={busy}
                  onClick={() => run({ type: 'erase-copy', store: selected })}
                >
                  Erase this copy
                </button>
              )}
              {selected === 'backup' &&
                restoreRoute(file)?.kind === 'possible' &&
                nextStep(file).command?.type !== 'restore' && (
                  <button className="paper-link" disabled={busy} onClick={() => run({ type: 'restore' })}>
                    Restore from this vault
                  </button>
                )}
            </div>
          )}
          <button className="paper-link" onClick={clearSelection}>
            <ArrowLeft size={14} />
            Back to case file
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

// A winged death's head is the printer's ornament on the case file.
function DeathHead() {
  const wing =
    'M71 25C57 11 33 12 8 2Q17 13 40 20L16 13Q24 22 48 27L28 24Q35 32 55 32L42 31Q50 37 66 35L71 30Z';
  return (
    <svg className="death-head" viewBox="0 0 164 49" fill="none" aria-hidden="true">
      <g fill="currentColor">
        <path d={wing} />
        <path d={wing} transform="translate(164) scale(-1 1)" />
        <path d="M71 35C64 31 65 20 70 16Q75 10 82 10Q92 10 97 19C100 25 99 33 93 36L91 41 87 42 85 40 83 43 80 41 78 43 75 41 73 39Z" />
      </g>
      <g fill="#2a1926">
        <path d="M70 24Q74 19 80 24L79 29Q72 33 70 27Z M85 24Q91 18 95 23L93 29Q88 32 85 28Z M81 30L84 29 87 35 79 35Z" />
      </g>
      <path
        d="M74 14l8 1-3 4 4 2M74 33l3 1m10 1 4-2M78 39v4m5-5v5m5-6v5"
        stroke="#2a1926"
        strokeWidth="1.4"
      />
    </svg>
  );
}
