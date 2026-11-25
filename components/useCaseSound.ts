import { useCallback, useEffect, useRef, useState } from 'react';
import { CemeterySound } from '../lib/soundscape';
import type { Trace } from '../lib/trace';

const soundKey = 'afterimage:sound:v1';
function storeChoice(value: 'on' | 'off') {
  try {
    window.localStorage.setItem(soundKey, value);
  } catch {
    /* The choice still applies in this tab. */
  }
}

export function useCaseSound(notify: (message: string) => void) {
  const [audible, setAudible] = useState(false);
  const engine = useRef<CemeterySound | null>(null);
  const wanted = useRef(false);
  const cueNumber = useRef(0);

  const start = useCallback(
    async (entrance: boolean) => {
      let player = engine.current;
      try {
        if (!player) {
          player = new CemeterySound();
          engine.current = player;
        }
        const current = player;
        const sync = () => {
          if (engine.current === current) setAudible(current.context.state === 'running');
        };
        current.context.onstatechange = sync;
        // Call resume inside the entry click, before other asynchronous work.
        await current.context.resume();
        if (engine.current !== current) return;
        sync();
        if (entrance && current.context.state === 'running' && !document.hidden) current.enter();
      } catch {
        if (engine.current !== player) return;
        engine.current = null;
        player?.close();
        wanted.current = false;
        setAudible(false);
        notify('Sound could not start. Use the sound button to try again.');
      }
    },
    [notify]
  );

  useEffect(() => {
    try {
      wanted.current = window.localStorage.getItem(soundKey) === 'on';
    } catch {
      /* Optional storage. */
    }
    const resumeOnGesture = (event: MouseEvent) => {
      if (!event.isTrusted || !wanted.current || document.hidden) return;
      if (event.target instanceof Element && event.target.closest('[data-sound-control], .field-guide'))
        return;
      if (engine.current?.context.state !== 'running') void start(false);
    };
    const visibility = () => {
      const ctx = engine.current?.context;
      if (!ctx || ctx.state === 'closed') return;
      if (document.hidden) {
        cueNumber.current++;
        engine.current?.cancelCue();
        void ctx.suspend().catch(() => {});
      } else if (wanted.current) void start(false);
    };
    document.addEventListener('click', resumeOnGesture, true);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      document.removeEventListener('click', resumeOnGesture, true);
      document.removeEventListener('visibilitychange', visibility);
      const old = engine.current;
      engine.current = null;
      old?.close();
    };
  }, [start]);

  function turnOn() {
    wanted.current = true;
    storeChoice('on');
    void start(true);
  }
  function turnOff() {
    wanted.current = false;
    storeChoice('off');
    const old = engine.current;
    engine.current = null;
    old?.close();
    setAudible(false);
  }
  function stopCue() {
    cueNumber.current++;
    engine.current?.cancelCue();
  }
  function play(trace: Trace) {
    const player = engine.current;
    if (!player || !wanted.current || document.hidden) return;
    const number = ++cueNumber.current;
    if (player.context.state === 'running') player.play(trace);
    else
      void player.context
        .resume()
        .then(() => {
          if (engine.current === player && number === cueNumber.current && !document.hidden)
            player.play(trace);
        })
        .catch(() => {});
  }
  return { audible, turnOn, turnOff, play, stopCue };
}
