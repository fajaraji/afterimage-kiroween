import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { ChevronDown, CircleDashed, Expand, Ghost, RotateCcw, X } from 'lucide-react';
import { evidence, statusText, STORES, STORE_IDS } from '../lib/case';
import type { CaseFile, Command, StoreId } from '../lib/case';
import type { Playback } from '../lib/trace';
import { nextStep, restoreRoute } from '../lib/investigation';
import { AtlasCanvas } from './atlas/AtlasCanvas';
import { NARROW, WIDE } from './atlas/geometry';
import { RETURN_SCENE } from '../lib/haunting';
import { CaseActions } from './CaseActions';
import { clockTime, Grave, StatusIcon } from './Common';

export function Graveyard({
  file,
  selected,
  onSelect,
  pending,
  play,
  replay,
  replayReturn,
  busy,
  run,
  certificate
}: {
  file: CaseFile;
  selected: StoreId | null;
  onSelect: (id: StoreId) => void;
  pending: Command | null;
  play: Playback | null;
  replay: () => void;
  replayReturn: () => void;
  busy: boolean;
  run: (command: Command) => void;
  certificate: () => void;
}) {
  const [paths, setPaths] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const route = useMemo(() => restoreRoute(file), [file]);
  const tools = useRef<HTMLDetailsElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const last = file.events.at(-1)!;
  const step = nextStep(file);
  const [watching, setWatching] = useState(false);
  useEffect(() => {
    if (!play?.trace.confirmedReturn || !Number.isFinite(play.at)) {
      setWatching(false);
      return;
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer = 0;
    const update = () => {
      window.clearTimeout(timer);
      const remaining = play.at + RETURN_SCENE.retreatAt * 1000 - performance.now();
      const visible = remaining > 0 && !document.hidden && !reduced.matches;
      setWatching(visible);
      if (visible) timer = window.setTimeout(() => setWatching(false), remaining);
    };
    update();
    reduced.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    return () => {
      window.clearTimeout(timer);
      reduced.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', update);
    };
  }, [play]);
  function closeTools() {
    if (!tools.current?.open) return;
    tools.current.open = false;
    tools.current.querySelector('summary')?.focus({ preventScroll: true });
  }

  function select(id: StoreId) {
    dialog.current?.close();
    onSelect(id);
  }
  function atlas() {
    return (
      <div className="atlas-viewport">
        <div className="atlas-frame">
          <AtlasCanvas
            recovery={route}
            file={file}
            selected={selected}
            paths={paths}
            pending={pending}
            play={play}
          />
          {route?.kind === 'confirmed' && (
            <div className="return-imprint" role="note" aria-label="Confirmed return">
              <span>Return confirmed</span>
              <strong>{file.subject.name}</strong>
              <small>
                {STORES[route.source].name} → Primary ·{' '}
                {clockTime(
                  file.events.findLast((event) => event.kind === 'return' && event.store === 'primary')!.at
                )}{' '}
                UTC
              </small>
            </div>
          )}
          {STORE_IDS.map((id) => {
            const item = evidence(file, id);
            const position: CSSProperties = {
              '--x-wide': (WIDE.plots[id][0] / WIDE.width) * 100 + '%',
              '--y-wide': ((WIDE.plots[id][1] + 30 * WIDE.scale) / WIDE.height) * 100 + '%',
              '--x-small': (NARROW.plots[id][0] / NARROW.width) * 100 + '%',
              '--y-small': ((NARROW.plots[id][1] + 30 * NARROW.scale) / NARROW.height) * 100 + '%'
            } as CSSProperties;
            return (
              <button
                key={id}
                type="button"
                className={'map-node ' + (item.pendingCheck ? 'pending' : item.finding)}
                data-store={id}
                aria-label={STORES[id].name + ', ' + statusText(item) + '. View evidence'}
                aria-controls="case-panel"
                aria-pressed={selected === id}
                style={position}
                onClick={() => select(id)}
              >
                <span className="plot-name">{STORES[id].name}</span>
                <span className="plot-status">
                  <StatusIcon item={item} size={11} />
                  {statusText(item)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }
  const caption = pending
    ? pending.type === 'restore'
      ? 'Opening the retained snapshot…'
      : pending.type === 'scan' || pending.type === 'inspect'
        ? 'Reading storage…'
        : 'Requesting erasure…'
    : (play?.trace.title ?? last.title);
  return (
    <section className="atlas-sheet" id="atlas" aria-labelledby="map-title">
      <section className="field-instruction" aria-label="Investigation guide">
        <ol className="case-itinerary" aria-label="Your progress">
          {['Erase', 'Inspect', 'Restore', 'Report'].map((name, index) => (
            <li key={name} aria-current={index + 1 === step.number ? 'step' : undefined}>
              <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span> {name}
            </li>
          ))}
        </ol>
        <div className="instruction-copy" aria-live="polite" aria-atomic="true">
          <h2>{watching ? 'Watch the primary grave.' : step.title}</h2>
          <p id="step-hint">
            {watching
              ? 'The read has confirmed a return. Follow the record out of the vault and back into the archive.'
              : step.hint}
          </p>
        </div>
      </section>
      <div className="atlas-top">
        <div className="map-heading">
          <h2 id="map-title">Cemetery map</h2>
          <p>Select a grave for its evidence.</p>
        </div>
        <details
          className="map-tools"
          ref={tools}
          onKeyDown={(event) => {
            if (event.key === 'Escape') closeTools();
          }}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false;
          }}
        >
          <summary>
            Map tools <ChevronDown size={13} />
          </summary>
          <div className="map-tool-list">
            <label>
              <input type="checkbox" checked={paths} onChange={(event) => setPaths(event.target.checked)} />
              Show paths
            </label>
            <button
              type="button"
              onClick={() => {
                closeTools();
                setExpanded(true);
                dialog.current?.showModal();
              }}
            >
              <Expand size={15} />
              Expand map
            </button>
            {play && (
              <button
                type="button"
                disabled={!!pending}
                onClick={() => {
                  closeTools();
                  replay();
                }}
              >
                <RotateCcw size={15} />
                Replay last scene
              </button>
            )}
          </div>
        </details>
      </div>
      {atlas()}
      <CaseActions step={step} busy={busy} watching={watching} run={run} certificate={certificate} />
      <div className="atlas-foot">
        <div className="map-legend">
          <span>
            <Ghost size={14} />
            Copy found
          </span>
          <span>
            <Grave size={14} />
            Verified clear
          </span>
          <span>
            <CircleDashed size={13} />
            Unverified
          </span>
          {paths && route && (
            <span className={'route-key ' + route.kind}>
              <i aria-hidden="true" />
              {route.kind === 'possible' ? 'Possible restore' : 'Confirmed return'}
            </span>
          )}
        </div>
      </div>
      <div className="trace-strip">
        <div>
          <span className="trace-tick" aria-hidden="true" />
          <span role="status">
            {caption}
            {!pending && play?.trace.kind === 'inspect' && <> · {play.trace.detail}</>}
          </span>
        </div>
        {route?.kind === 'confirmed' && (
          <button className="replay" disabled={watching || !!pending} onClick={replayReturn}>
            <RotateCcw size={14} />
            Replay the return
          </button>
        )}
      </div>
      <dialog
        className="map-dialog"
        ref={dialog}
        aria-label="Expanded graveyard map"
        onClose={() => setExpanded(false)}
      >
        <div className="atlas-top">
          <h2>Cemetery map</h2>
          <div className="atlas-tools">
            {play && (
              <button className="replay" onClick={replay} disabled={!!pending}>
                Replay trace
              </button>
            )}
            <button
              className="icon-button"
              aria-label="Close expanded map"
              onClick={() => dialog.current?.close()}
            >
              <X size={18} />
            </button>
          </div>
        </div>
        {expanded && atlas()}
      </dialog>
    </section>
  );
}
