'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Activity, ArrowRight, Check, FileBadge, LoaderCircle, Map, RotateCcw, Volume2, VolumeX, X } from 'lucide-react';
import { commandCase, demoMode, openCase } from '../lib/gateway';
import type { CaseFile, Command, StoreId } from '../lib/case';
import { openPlayback, traceResult } from '../lib/trace';
import type { Playback } from '../lib/trace';
import { CaseActions } from './CaseActions';
import { CasePanel } from './CasePanel';
import { Certificate, EventLog } from './Evidence';
import { Graveyard } from './Graveyard';
import { Ledger } from './Ledger';

const PAGES = {
  investigation: { label: 'Investigation', icon: Map, title: 'The haunted', italic: 'archive', description: 'Erase a record. Find the copies that come back to haunt it.' },
  events: { label: 'Event log', icon: Activity, title: 'Event', italic: 'log', description: 'Follow the reads, erasures and restores recorded in this case.' },
  certificate: { label: 'Certificate', icon: FileBadge, title: 'Erasure', italic: 'certificate', description: 'Review and export the evidence from the latest inspection.' }
};
type Page = keyof typeof PAGES;

function pageFromHash(): Page {
  const hash = window.location.hash.slice(1);
  return hash === 'events' || hash === 'certificate' ? hash : 'investigation';
}

let firstOpen: Promise<CaseFile> | undefined;

export function Workspace() {
  const [page, setPage] = useState<Page>('investigation');
  const [file, setFile] = useState<CaseFile | null>(null);
  const [selected, setSelected] = useState<StoreId | null>(null);
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState<Command|null>(null);
  const [play, setPlay] = useState<Playback|null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [sound, setSound] = useState(false);
  const audio = useRef<AudioContext | null>(null);
  const drone = useRef<OscillatorNode | null>(null);
  const lock = useRef(false);
  const resetDialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    let live = true;
    const readHash = () => setPage(pageFromHash());
    readHash();
    window.addEventListener('hashchange', readHash);
    firstOpen ??= openCase();
    firstOpen.then(result => {
      if (!live) return;
      setFile(result);
      setPlay(openPlayback(result,demoMode,performance.now()));
    }).catch(reason => {
      firstOpen = undefined;
      if (live) setError(reason.message || 'Could not open this case.');
    });
    return () => { live = false; window.removeEventListener('hashchange', readHash); };
  }, []);
  useEffect(() => () => { void audio.current?.close(); }, []);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(''), 4800);
    return () => window.clearTimeout(timer);
  }, [notice]);

  function chime(restore: boolean) {
    const ctx = audio.current;
    if (!sound || !ctx || ctx.state !== 'running') return;
    const oscillator = ctx.createOscillator();
    const volume = ctx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(restore ? 196 : 440, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(restore ? 523 : 330, ctx.currentTime + 0.45);
    volume.gain.setValueAtTime(0.035, ctx.currentTime);
    volume.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.65);
    oscillator.connect(volume).connect(ctx.destination);
    oscillator.start(); oscillator.stop(ctx.currentTime + 0.7);
  }
  async function toggleSound() {
    try {
      if (sound) {
        drone.current?.stop();
        drone.current = null;
        await audio.current?.suspend();
        setSound(false);
        return;
      }
      const ctx = audio.current ?? new AudioContext();
      audio.current = ctx;
      await ctx.resume();
      const tone = ctx.createOscillator(), gain = ctx.createGain();
      tone.frequency.value = 82.41; gain.gain.value = 0.008;
      tone.connect(gain).connect(ctx.destination);
      tone.start(); drone.current = tone; setSound(true);
    } catch { setNotice('Audio is unavailable in this browser.'); }
  }

  async function perform(command?: Command, reset = false) {
    if (lock.current) return;
    lock.current = true; setBusy(true); setError(''); setNotice('');
    setPending(command ?? null);
    const atlas = document.getElementById('atlas');
    if (command && atlas && (atlas.getBoundingClientRect().top < -95 || atlas.getBoundingClientRect().top > window.innerHeight * .6)) {
      atlas.scrollIntoView({block:'start',behavior:'instant'});
    }
    try {
      const result = command && file ? await commandCase(file, command) : await openCase(reset);
      setFile(result);
      firstOpen = Promise.resolve(result);
      if (command && file) {
        chime(command.type === 'restore');
        setPlay({trace:traceResult(file,result,command),before:file.stores,at:performance.now()});
        if (command.type === 'restore') setSelected('primary');
      } else {
        setPlay(openPlayback(result,demoMode,performance.now()));
        if(reset){setSelected(null); window.location.hash = 'investigation'; setNotice('A fresh case is ready.');}
      }
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'The operation could not be completed.'); }
    finally { lock.current = false; setBusy(false); setPending(null); }
  }

  const chooseStore = useCallback((id: StoreId) => {
    setSelected(id);
    const atlas=document.getElementById('atlas');
    if(atlas && atlas.getBoundingClientRect().bottom < window.innerHeight*.35) {
      atlas.scrollIntoView({behavior:'instant',block:'start'});
      atlas.querySelector<HTMLButtonElement>('[data-store="'+id+'"]')?.focus({preventScroll:true});
    }
  }, []);
  const labels = PAGES[page];
  function navigate(target: Page) {
    window.location.hash = target;
    window.scrollTo({top:0,behavior:'instant'});
  }

  return <><a className="skip-link" href="#workspace" onClick={event=>{event.preventDefault();document.getElementById('workspace')?.focus();}}>Skip to workspace</a>
    <header className="site-header"><div className="header-inner">
      <a className="brand" href="#investigation" aria-label="Afterimage investigation"><img className="brand-mark" src="/icon.svg" width="36" height="35" alt="" />Afterimage</a>
      <nav aria-label="Workspace views">{(Object.keys(PAGES) as Page[]).map(key => { const tab = PAGES[key]; const Icon = tab.icon;
        return <a key={key} href={'#' + key} aria-current={page === key ? 'page' : undefined}><Icon size={15}/>{tab.label}</a>;
      })}</nav>
      <div className="header-tools"><span className="environment"><i/>{demoMode ? 'Demo workspace' : 'Connected workspace'}</span><button className={'sound-toggle' + (sound ? ' on' : '')} aria-pressed={sound} aria-label={sound ? 'Mute ambient sound' : 'Enable ambient sound'} title={sound ? 'Mute ambient sound' : 'Enable ambient sound'} onClick={toggleSound}>{sound ? <Volume2 size={17}/> : <VolumeX size={17}/>}</button></div>
    </div></header>
    <main className="workspace" id="workspace" tabIndex={-1}>
      <div className="heading-row"><div>
        <h1>{labels.title} <em>{labels.italic}</em></h1><p className="page-intro">{labels.description}</p></div>
        {file && <button className="secondary-button reset" disabled={busy} onClick={() => resetDialog.current?.showModal()}><RotateCcw size={14}/><span>Reset case</span></button>}
      </div>
      {error && <div className="error-banner" role="alert"><span>{error}</span><button className="secondary-button" disabled={busy} onClick={() => void perform()}>Reload case</button>{!file && <button className="secondary-button" disabled={busy} onClick={() => void perform(undefined,true)}>New case</button>}</div>}
      {!file && !error && <div className="loading" role="status"><LoaderCircle className="spin" size={18}/>Opening case…</div>}
      {file && <>
        {page === 'investigation' && <><div className="investigation-grid">
          <Graveyard file={file} selected={selected} onSelect={chooseStore} pending={pending} play={play} replay={()=>setPlay(current=>current?{...current,at:performance.now()}:null)}>
            <CaseActions file={file} selected={selected} busy={busy || !!error} run={perform} certificate={()=>navigate('certificate')}/>
          </Graveyard>
          <CasePanel file={file} selected={selected} clearSelection={()=>setSelected(null)} openLog={()=>navigate('events')}/>
        </div><Ledger file={file} selected={selected} onSelect={chooseStore} busy={busy || !!error} onScan={() => void perform({type:'scan'})}/></>}
        {page === 'events' && <EventLog file={file}/>}
        {page === 'certificate' && <Certificate file={file} demo={demoMode}/>}
      </>}
    </main>
    <div className={'toast' + (notice ? ' visible' : '')} role="status" aria-live="polite">{notice && <><Check size={16}/>{notice}<button className="icon-button" aria-label="Dismiss notification" onClick={() => setNotice('')}><X size={14}/></button></>}</div>
    <dialog className="reset-dialog" ref={resetDialog} aria-labelledby="reset-title"><span className="dialog-symbol"><RotateCcw size={22}/></span><h2 id="reset-title">Reset this case?</h2>
      <p>This starts a fresh case with all four copies present. The current findings and event log will leave this workspace.</p><div className="dialog-actions"><button className="secondary-button" autoFocus onClick={() => resetDialog.current?.close()}>Keep case</button><button className="primary-button" onClick={() => { resetDialog.current?.close(); void perform(undefined,true); }}>Reset case<ArrowRight size={15}/></button></div>
    </dialog>
  </>;
}
