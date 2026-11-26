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
  const wanted = useRef(true);
  const cueNumber = useRef(0);

  const start = useCallback(
    async (manual = false) => {
      if (!wanted.current || document.hidden) return;
      let player = engine.current;
      try {
        if (!player) {
          player = new CemeterySound();
          engine.current = player;
        }
        const current = player;
        const sync = () => {
          if (engine.current !== current) return;
          const playing =
            wanted.current &&
            !document.hidden &&
            current.hasAmbience &&
            current.context.state === 'running';
          setAudible(playing);
        };
        current.context.onstatechange = sync;
        const ambience = current.enter();
        if (current.context.state !== 'running') await current.context.resume();
        if (!(await ambience) && manual && engine.current === current)
          notify('The cemetery recording could not load. Try the sound control again.');
        sync();
      } catch {
        if (engine.current !== player) return;
        if (manual) notify('Sound could not start. Try the sound control again.');
      }
    },
    [notify]
  );

  useEffect(() => {
    try {
      wanted.current = window.localStorage.getItem(soundKey) !== 'off';
    } catch {
      wanted.current = true;
    }
    void start();
    const resumeOnGesture = (event: Event) => {
      if (!event.isTrusted || (engine.current?.context.state === 'running' && engine.current.hasAmbience))
        return;
      if (
        event instanceof KeyboardEvent &&
        (event.metaKey || event.ctrlKey || event.altKey || event.repeat)
      )
        return;
      if (event.target instanceof Element && event.target.closest('[data-sound-control]')) return;
      void start();
    };
    const visibility = () => {
      if (document.hidden) {
        cueNumber.current++;
        engine.current?.cancelCue();
        void engine.current?.context.suspend().catch(() => {});
      } else void start();
    };
    document.addEventListener('click', resumeOnGesture, true);
    document.addEventListener('pointerup', resumeOnGesture, true);
    document.addEventListener('keydown', resumeOnGesture, true);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      document.removeEventListener('click', resumeOnGesture, true);
      document.removeEventListener('pointerup', resumeOnGesture, true);
      document.removeEventListener('keydown', resumeOnGesture, true);
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
    cueNumber.current++;
    const old = engine.current;
    engine.current = null;
    old?.close();
    setAudible(false);
  }
  const stopCue = useCallback(() => {
    cueNumber.current++;
    engine.current?.cancelCue();
  }, []);
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
