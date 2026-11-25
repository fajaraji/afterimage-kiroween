import { useEffect, useRef } from 'react';
import type { CaseFile, Command, StoreId } from '../../lib/case';
import type { RestoreRoute } from '../../lib/investigation';
import type { Playback } from '../../lib/trace';
import { NARROW, NARROW_WIDTH, WIDE } from './geometry';
import type { Plan } from './geometry';
import { RETURN_SCENE } from '../../lib/haunting';
import { drawHaunting, drawMoonWitness } from './apparition';
import { drawAtlas, drawTerrain, TRACE_SECONDS } from './draw';

export function AtlasCanvas({
  file,
  recovery,
  selected,
  paths,
  play,
  pending
}: {
  file: CaseFile;
  recovery: RestoreRoute | null;
  selected: StoreId | null;
  paths: boolean;
  play: Playback | null;
  pending: Command | null;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const terrain = useRef<{ layer: HTMLCanvasElement; plan?: Plan } | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const cached = (terrain.current ??= { layer: document.createElement('canvas') });
    const ground = cached.layer;
    const groundCtx = ground.getContext('2d');
    if (!groundCtx) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0,
      plan = WIDE;
    const confirmedScene = play?.trace.kind === 'restore' && play.trace.confirmedReturn === true;
    const duration = confirmedScene ? RETURN_SCENE.end : TRACE_SECONDS;
    function draw(now: number) {
      const t =
        play && !reduced.matches && !document.hidden ? Math.max(0, (now - play.at) / 1000) : duration;
      const active = !!play && !pending && t < duration;
      const phase =
        active && confirmedScene
          ? t < RETURN_SCENE.voiceAt
            ? 'vault'
            : t < RETURN_SCENE.retreatAt
              ? 'apparition'
              : 'retreat'
          : 'still';
      if (canvas!.dataset.scene !== phase) canvas!.dataset.scene = phase;
      canvas!.dataset.playing = String(active);
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.drawImage(ground, 0, 0);
      ctx!.setTransform(canvas!.width / plan.width, 0, 0, canvas!.height / plan.height, 0, 0);
      drawAtlas(ctx!, plan, file, recovery, selected, paths, active ? play : null, t, pending);
      if (active && confirmedScene) drawHaunting(ctx!, plan, t);
      else if (recovery?.kind === 'confirmed') drawMoonWitness(ctx!, plan);
      if (active) frame = requestAnimationFrame(draw);
    }
    function paint() {
      cancelAnimationFrame(frame);
      const bounds = canvas!.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      plan = bounds.width <= NARROW_WIDTH ? NARROW : WIDE;
      const width = Math.round(bounds.width * dpr);
      const height = Math.round(bounds.height * dpr);
      if (canvas!.width !== width || canvas!.height !== height) {
        canvas!.width = width;
        canvas!.height = height;
      }
      if (ground.width !== width || ground.height !== height || cached.plan !== plan) {
        ground.width = width;
        ground.height = height;
        groundCtx!.setTransform(width / plan.width, 0, 0, height / plan.height, 0, 0);
        drawTerrain(groundCtx!, plan);
        cached.plan = plan;
      }
      draw(performance.now());
    }
    const observer = new ResizeObserver(paint);
    observer.observe(canvas);
    reduced.addEventListener('change', paint);
    document.addEventListener('visibilitychange', paint);
    paint();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      reduced.removeEventListener('change', paint);
      document.removeEventListener('visibilitychange', paint);
    };
  }, [file, recovery, selected, paths, play, pending]);
  return (
    <canvas
      ref={ref}
      className="atlas-canvas"
      width="800"
      height="416"
      aria-hidden="true"
      data-trace={play?.trace.kind ?? 'still'}
    />
  );
}
