import { useRef, useState } from 'react';
import { CircleDashed, Expand, Ghost, Map, Route, X } from 'lucide-react';
import { evidence, statusText, STORES, STORE_IDS } from '../lib/case';
import type { CaseFile, StoreId } from '../lib/case';
import { Grave, StatusIcon } from './Common';

const POSITIONS = { primary: [50.3, 39], analytics: [22.2, 59], export: [79, 57], backup: [50.8, 87] } as const;

export function Graveyard({ file, selected, onSelect, busy }: {
  file: CaseFile; selected: StoreId | null; onSelect: (id: StoreId) => void; busy: boolean;
}) {
  const [paths, setPaths] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const returned = evidence(file, 'primary').finding === 'returned';
  const lastReturn = file.events.findLast(event => event.kind === 'return')?.seq;
  function select(id: StoreId) {
    dialog.current?.close();
    onSelect(id);
  }
  function atlas() {
    return <div className={'map-stage' + (busy ? ' scanning' : '')}>
      <div className="map-world">
        <img className="map-image" src="/graveyard.webp" alt="" fetchPriority="high" width="1536" height="1024" />
        <div className="map-wash" />
        {paths && <svg className="trails" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <g className={file.erasureRequested ? 'surveyed' : ''}>
            <path d="M50.3 39 Q49 51 22.2 59 M50.3 39 Q54 49 79 57 M50.3 39 Q43 63 50.8 87" />
          </g>
          {returned && <path key={lastReturn} className="return-path" d="M50.8 87 Q43 63 50.3 39" pathLength="100" />}
        </svg>}
        {STORE_IDS.map(id => {
          const item = evidence(file, id);
          const ghost = item.finding === 'found' || item.finding === 'returned';
          const clear = item.finding === 'clear' && !item.pendingCheck;
          return <button type="button" key={id}
            className={'map-node ' + (selected === id ? 'selected ' : '') + (item.pendingCheck ? 'pending' : item.finding)}
            aria-pressed={selected === id} aria-label={'Select ' + STORES[id].name + ' on map, ' + statusText(item)}
            style={{ left: POSITIONS[id][0] + '%', top: POSITIONS[id][1] + '%' }} onClick={() => select(id)}>
            {item.finding === 'returned' && <span className="grave-marker fading"><Grave size={24}/></span>}
            {ghost && <span key={id === 'primary' ? lastReturn : id} className={'apparition' + (item.finding === 'returned' ? ' rising' : '')} aria-hidden="true"><Ghost size={30} /></span>}
            {clear && <span className="grave-marker"><Grave size={24} /></span>}
            <span className="node-label"><StatusIcon item={item} size={13} />{STORES[id].short}</span>
          </button>;
        })}
      </div>
      {busy && <div className="scan-sweep" aria-hidden="true" />}
    </div>;
  }
  return <section className="panel map-panel" aria-labelledby="map-title">
    <div className="panel-bar"><h2 id="map-title"><Map />The graveyard</h2><div className="map-tools">
      <button className={'map-switch ' + (paths ? 'enabled' : '')} aria-pressed={paths} onClick={() => setPaths(!paths)}><Route size={14} />Paths</button>
      <button aria-label="Expand graveyard map" className="icon-button expand" onClick={() => { setExpanded(true); dialog.current?.showModal(); }}><Expand size={16} /></button>
    </div></div>
    {atlas()}
    <div className="map-legend"><span><Ghost size={15} className="mint-text" />Copy found</span><span><Grave />Verified clear</span><span><CircleDashed size={14} />Unverified</span></div>
    <dialog ref={dialog} className="map-dialog" aria-label="Expanded graveyard map" onClose={() => setExpanded(false)}>
      <div className="panel-bar"><h2><Map />The graveyard</h2><button className="icon-button" aria-label="Close expanded map" onClick={() => dialog.current?.close()}><X size={18} /></button></div>
      {expanded && atlas()}
    </dialog>
  </section>;
}
