import { useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { CircleDashed, Expand, Ghost, RotateCcw, Route, X } from 'lucide-react';
import { evidence, statusText, STORES, STORE_IDS } from '../lib/case';
import type { CaseFile, Command, StoreId } from '../lib/case';
import type { Playback } from '../lib/trace';
import { AtlasCanvas } from './atlas/AtlasCanvas';
import { NARROW, WIDE } from './atlas/geometry';
import { Grave, StatusIcon } from './Common';

export function Graveyard({
  file,
  selected,
  onSelect,
  pending,
  play,
  replay,
  children
}: {
  file: CaseFile;
  selected: StoreId | null;
  onSelect: (id: StoreId) => void;
  pending: Command | null;
  play: Playback | null;
  replay: () => void;
  children: ReactNode;
}) {
  const [paths, setPaths] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const last = file.events.at(-1)!;
  function select(id: StoreId) {
    dialog.current?.close();
    onSelect(id);
  }
  function atlas() {
    return (
      <div className="atlas-viewport">
        <div className="atlas-frame">
          <AtlasCanvas file={file} selected={selected} paths={paths} pending={pending} play={play} />
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
      <div className="atlas-top">
        <h2 id="map-title">Storage grounds</h2>
        <div className="atlas-tools">
          <button className="map-switch" aria-pressed={paths} onClick={() => setPaths(!paths)}>
            <Route size={15} />
            Paths
          </button>
          <button
            className="icon-button"
            aria-label="Expand graveyard map"
            onClick={() => {
              setExpanded(true);
              dialog.current?.showModal();
            }}
          >
            <Expand size={16} />
          </button>
        </div>
      </div>
      {atlas()}
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
        {play && (
          <button className="replay" disabled={!!pending} onClick={replay} aria-label="Replay last trace">
            <RotateCcw size={13} />
            Replay
          </button>
        )}
      </div>
      {children}
      <dialog
        className="map-dialog"
        ref={dialog}
        aria-label="Expanded graveyard map"
        onClose={() => setExpanded(false)}
      >
        <div className="atlas-top">
          <h2>Storage grounds</h2>
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
